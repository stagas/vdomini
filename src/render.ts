import type { VNode, VProps, VChild, FunctionalComponent } from './h'
import { toCssText, xhtml, svg } from './util'
import { Fragment } from './h'
import { Any, SafeMap, SafeWeakMap } from './types'

//
//
// business logic types
//
//

/**
 * A hook that enables reactive programming. It can
 * be obtained using the export [current.hook](#hook)
 * from inside a functional component and triggered
 * using `trigger(hook)`.
 */
export interface VHook {
  v: VNode
  doc: VObjectNode['doc']
  parent?: Element
  children: (Element | Text)[]
}

export interface VObjectText {
  create(parent: Element): Text
  replace(parent: Element, child: Element): void
  text: string
  hook?: VHook
}

export interface VObjectNode {
  create(parent: Element): Element
  replace(parent: Element, child: Element): void
  options: { is?: string }
  doc: typeof xhtml
  type: string
  props: VNode['props']
  children: VObject[] & { keyed?: boolean }
  hook?: VHook
}

export interface VObjectKeyedNode extends VObjectNode {
  props: VObjectNode['props'] & { key: object }
}

export type VObjectAny = (VObjectNode | VObjectText) & VObjectInterface

export type VObject = Partial<VObjectText> & Partial<VObjectNode> & Partial<VObjectKeyedNode> & VObjectInterface

export type VObjectInterface = {
  create<T>(this: T, parent: Element): Element | Text
  replace<T>(this: T, parent: Element, child: Element | Text): void
}

//
//
// caches
//
//

type PropCacheItem = {
  attrs: Record<string, Attr>
  props: Record<string, unknown>
}
const propCache = new WeakMap() as SafeWeakMap<object, PropCacheItem>

type ListKey = { i: number; el: Element }
type ListKeysCache = {
  prev: VObjectKeyedNode[]
  keys: SafeMap<object, ListKey>
  touched: Set<object>
}
const listKeysCache = new WeakMap() as SafeWeakMap<Node, ListKeysCache>

export const hooks = new WeakMap() as SafeWeakMap<
  VNode | VObject | VObjectText | VObjectNode | VObjectNode['children'],
  VHook
>

//
//
// props
//
//

const createProp = (el: Element, _type: string, name: string, value: unknown, attrs: Record<string, Attr>) => {
  // all the Any's below are on purpose
  // all the cases should be taken care of,
  // but since this is user input they are allowed
  // to do something wrong and we want to raise an
  // exception and get a stack trace back here.

  // special cases
  switch (name) {
    case 'key':
      return
    case 'ref':
      if (value) (value as Any).current = el
      return

    // "value" and "checked" properties have to be set
    // directly on the element when it's an input to
    // properly diff later (see updateProps)
    case 'value':
    case 'checked':
      ;(el as Any)[name] = value
      return

    case 'style':
      // if we createAttribute and set .value then that
      // triggers the css parser and we can't compare if
      // the two values are similar during updates.
      // doing it this way retains the exact string and
      // is faster.
      el.setAttribute('style', value as string)
      // we know there is an attribute node because we
      // just set it
      attrs.style = el.getAttributeNode('style')!
      return
  }

  //
  // create prop
  //

  // we used to normalize the attribute name
  // but now we don't. because there is a high
  // probability we will need a version that
  // normalizes attribute names we leave it here
  // commented (attr)
  const attr = name //toAttr[name] || name

  switch (typeof value) {
    case 'string':
    case 'number':
      el.setAttribute(attr, value as string)
      attrs[attr] = el.getAttributeNode(attr)!
      return
    case 'function':
      el.setAttribute(attr, '')
      attrs[attr] = el.getAttributeNode(attr)!
      ;(el as Any)[name] = value
      return
    case 'boolean':
      if (value) {
        el.setAttribute(attr, '')
        attrs[attr] = el.getAttributeNode(attr)!
      }
      return
    default:
      if (value != null) {
        try {
          ;(el as Any)[name] = value
        } catch {
          //
        }
      }
  }
}

const createProps = (el: Element, type: string, props: Record<string, unknown>, attrs: Record<string, Attr> = {}) => {
  for (const name in props) createProp(el, type, name, props[name], attrs)
  propCache.set(el, { props, attrs })
}

const updateProps = (el: Element, type: string, next: VProps) => {
  if (!propCache.has(el)) return next && createProps(el, type, next)

  const c = propCache.get(el)
  const { attrs, props } = c
  if (!next) {
    for (const name in attrs) el.removeAttributeNode(attrs[name])
    for (const name in props) delete (el as Any)[name]
    propCache.delete(el)
    return
  }

  let value
  out: for (const name in props) {
    // removed prop
    if (!(name in next)) {
      delete (el as Any)[name]
      continue
    }

    value = next[name]

    switch (name) {
      case 'ref':
        if (el !== (value as Any).current) (value as Any).current = el
        continue out

      // "value" and "checked" properties change directly on the element when
      // editing an input so we can't diff and have to check it directly
      case 'value':
      case 'checked':
        // don't try to update value when element has focus
        // because user is editing and it messes up everything
        // TODO: any way around this?
        ;(el as Any)[name] !== value && document.activeElement !== el && ((el as Any)[name] = value)
        continue out
    }

    // updated prop
    if (props[name] !== value) {
      if (typeof value === 'function') {
        const attr = name //toAttr[name] || name
        props[attr] = (el as Any)[attr] = value
      } else if (!(name in attrs))
        try {
          ;(el as Any)[name] = value
        } catch {
          //
        }
    }
  }

  for (const name in attrs) {
    // removed attribute
    if (!(name in next) || next[name] === false || next[name] == null) {
      el.removeAttributeNode(attrs[name])
      delete attrs[name]
      continue
    }

    // updated value
    if (props[name] !== (value = next[name]) && typeof value !== 'function') attrs[name].value = value as string
  }

  // created props
  for (const name in next) if (!(name in attrs) && !(name in props)) createProp(el, type, name, next[name], attrs)

  c.props = next
}

//
//
// expand vdom to their primitives
//
//

const expand = (v: VNode['children'] | VChild, doc = xhtml, parentHook?: VHook): VObjectNode['children'] => {
  switch (typeof v) {
    case 'string':
    case 'number': {
      return [
        {
          create: createText,
          replace: replaceText,
          text: '' + v,
          hook: parentHook,
        } as VObject & VObjectText,
      ]
    }
    case 'boolean':
    case 'undefined': {
      return [
        {
          create: createText,
          replace: replaceText,
          text: '',
          hook: parentHook,
        } as VObject & VObjectText,
      ]
    }
  }

  if (Array.isArray(v)) {
    const result: VObjectNode['children'] = []
    for (let i = 0; i < v.length; i++) result.push(...expand(v[i], doc, parentHook))
    result.keyed = result[0]?.props?.key != null
    return result
  }

  const type = v.type

  if (typeof type === 'function') {
    if (Object.getPrototypeOf(type) !== Function.prototype) {
      throw new Error('CustomElement constructors are not implemented yet')
    }

    // enables reactive updates as the function component that runs below
    // can access through the export `current.hook`.
    // TODO: only gather when requested with a getHook() ?
    const hook: VHook = (current.hook = parentHook ?? { v, doc, children: [] })

    const vNode = (type as FunctionalComponent)({
      ...v.props,
      children: v.children,
    })

    // this is a weird situation.
    // we special case "key" because when "expanding" the
    // function it doesn't have knowledge of the parent "key".
    // that was lost one level up, but also the child vNode
    // shouldn't have knowledge of the above party, that would
    // introduce coupling.
    // we want to be able to create lists of arbitrary components
    // but they have to be given the "key" from the parent component
    // so this is what is happening here.
    if (v.props?.key != null) vNode.props = { key: v.props.key, ...vNode.props }

    return expand(vNode, doc, hook)
  }

  switch (type) {
    case Fragment: {
      if (!v.children.length) v.children.push('') // must have a child for hooks to work (TODO: use comment node?)
      const children = expand(v.children, doc, parentHook)
      return children
    }

    // svg namespace entry
    case 'svg':
      doc = svg

    // eslint-disable-next-line no-fallthrough
    default: {
      if (v.props?.style) {
        if (typeof v.props.style === 'object') {
          v.props.style = toCssText(v.props.style as CSSStyleDeclaration)
        }
      }

      const options: { is?: string } = {}
      if (v.props?.is) options.is = v.props.is as string

      const vObject: VObjectNode = {
        create: createNode,
        replace: replaceNode,
        options,
        doc,
        type: type as string, // it's never symbol here we short circuit at Fragment ^
        props: v.props,
        children: expand(
          v.children,
          // svg namespace exodus
          (type === 'foreignObject' && xhtml) || doc
        ),
        hook: parentHook,
      }

      return [vObject as VObject & VObjectNode]
    }
  }
}

//
//
// (v)dom methods
//
//

const fulfillHook = <T extends Element | Text>(vNode: VObjectText | VObjectNode, parent: Element, child: T): T => {
  if (vNode.hook) {
    vNode.hook.parent = parent
    vNode.hook.children.push(child)
  }
  return child
}
function createText(this: VObjectText, parent: Element) {
  return fulfillHook(this, parent, document.createTextNode(this.text))
}

function replaceText(this: VObjectText, parent: Element, child: Element | Text) {
  if (child.nodeName !== '#text') {
    const newChild = this.create(parent)
    parent.replaceChild(newChild, child)
    return
  }
  this.text !== child.nodeValue && (child.nodeValue = this.text)
  return
}

function createNode(this: VObjectNode, parent: Element) {
  const { doc, type, props, options, children } = this
  const child = doc.createElement.call(document, type, options)
  props && createProps(child, type, props)
  if (children.keyed) attach(child, children as VObjectKeyedNode[])
  else for (let i = 0; i < children.length; i++) append(child, children[i] as VObjectAny)
  return fulfillHook(this, parent, child)
}

// append or replace is where the hook needs to be set

function replaceNode(this: VObjectNode, parent: Element, child: Element) {
  if (child.nodeName.toUpperCase() !== this.type.toUpperCase()) {
    const newChild = this.create(parent)
    parent.replaceChild(newChild, child)
    return
  }

  updateProps(child, this.type, this.props)
  reconcile(child, this.children)
}

const append = (parent: Element, vNode: VObjectAny) => {
  const child = vNode.create(parent)
  parent.append(child)
  return child
}

//
//
// dom reconciliation algorithms
//
//

const attach = (el: Element, children: VObjectKeyedNode[]) => {
  const keys: SafeMap<object, ListKey> = new Map()
  for (let i = 0; i < children.length; i++) {
    const vNode = children[i]
    keys.set(vNode.props.key, {
      i,
      el: append(el, vNode as VObjectAny),
    } as ListKey)
  }
  listKeysCache.set(el, {
    touched: new Set(),
    prev: children,
    keys,
  })
}

const reconcileList = (parent: Element, cache: ListKeysCache, next: VObjectKeyedNode[]) => {
  const { prev, keys, touched } = cache

  touched.clear()

  for (let i = 0, left: Element; i < next.length; i++) {
    const vNode = next[i]

    const key = vNode.props.key
    touched.add(key)

    let child: Element

    if (!keys.has(key)) {
      // create
      child = vNode.create(parent)

      keys.set(key, { i, el: child })
      // we know left has been assigned because we're i>0
      if (i) left!.after(child)
      else parent.prepend(child)
    } else {
      const item = keys.get(key)

      child = item.el

      // update
      updateProps(child, vNode.type, vNode.props)
      reconcile(child, vNode.children)

      // move
      if (item.i > i) {
        keys.get(prev[i].props.key).i = item.i
        item.i = i
      }
      // we know left has been assigned because we're i>0
      if (i) left!.after(child)
      else parent.prepend(child)
    }

    left = child
  }

  for (const key of keys.keys()) {
    // remove
    if (!touched.has(key)) {
      parent.removeChild(keys.get(key).el)
      keys.delete(key)
    }
  }

  cache.prev = next
}

const reconcile = (parent: Element, next: VObjectNode['children']) => {
  if (listKeysCache.has(parent)) {
    reconcileList(
      parent,
      listKeysCache.get(parent),
      // we know it is a keyed node list because it was detected earlier
      // and it's presumed that the contract will not change
      next as VObjectKeyedNode[]
    )
    return
  } else if (next.keyed) {
    attach(parent, next as VObjectKeyedNode[])
    return
  }

  const prev = parent.childNodes as NodeListOf<Element>
  const prevLength = prev.length

  if (next.length >= prevLength) {
    for (let i = 0; i < prevLength; i++) next[i].replace(parent, prev[i])
    for (let i = prevLength; i < next.length; i++) append(parent, next[i] as VObjectAny)
  } else {
    for (let i = next.length; i < prevLength; i++) parent.removeChild(parent.lastChild!)
    for (let i = 0; i < next.length; i++) next[i].replace(parent, prev[i])
  }
}

//
//
// hooks
//
//

interface Current {
  hook: VHook | null
}

/**
 * The `current` singleton.
 */
export const current: Current = {
  /**
   * Holds a reference to a hook that can
   * be triggered later using {@link trigger}.
   */
  hook: null,
}

/**
 * Triggers a rerender on a hook.
 *
 * ```tsx
 * let hook
 * const Foo = () => {
 *   hook = current.hook
 *   return <p>{content}</p>
 * }
 * render(<Foo />, c)
 * trigger(hook)
 * ```
 *
 * @param hook The hook to trigger
 */
export const trigger = (hook: VHook) => {
  if (!hook.parent) {
    return
  }

  const v = expand(hook.v, hook.doc, hook)
  if (v.length > 1) {
    const range = document.createRange()
    range.setStartBefore(hook.children[0])
    range.setEndAfter(hook.children.at(-1)!)
    const fragment = range.extractContents()
    reconcile(fragment as never, v)
    range.insertNode(fragment)
  } else {
    v[0].replace(hook.parent, hook.children[0])
  }
}

//
//
// entry point render vdom to dom element
//
//

/**
 * Renders a virtual node on an html Element.
 *
 * ```tsx
 * render(<p>hello world</p>, document.body)
 * ```
 *
 * @param vNode The virtual node to render
 * @param el The target element to render on
 */
export const render = (vNode: VNode, el: Element) => {
  reconcile(el, expand(vNode))
}
