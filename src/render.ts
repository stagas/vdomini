import type { VNode, VProps, VChild, FunctionalComponent } from './h'
import { toCssText, xhtml, svg } from './util'
import { Fragment } from './h'

//
//
// utility types
//
//

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

interface SafeMap<K extends object, T> extends Map<K, T> {
  has(v: K): boolean
  get(v: K): T
}

interface SafeWeakMap<K extends object, T> extends WeakMap<K, T> {
  has(v: K): boolean
  get(v: K): T
}

//
//
// business logic types
//
//

/**
 * A hook that enables reactive programming. It can
 * be obtained using the export {@link current.hook}
 * from inside a functional component.
 *
 * ```ts
 * let hook
 * const Foo = () => {
 *   hook = current.hook
 *   return <p>{content}</p>
 * }
 * render(<Foo />, c)
 * trigger(hook)
 * ```
 */
export interface VHook {
  parent: Element
  child: Element | Text
  vNode: VNode
  doc: VObjectNode['doc']
}

export interface VObjectText {
  create(): Text
  replace(parent: Element, child: Element): void
  text: string
}

export interface VObjectNode {
  create(): Element
  replace(parent: Element, child: Element): void
  doc: typeof xhtml
  type: string
  props: VNode['props']
  children: VObject[] & { keyed?: boolean }
}

export interface VObjectKeyedNode extends VObjectNode {
  props: VObjectNode['props'] & { key: object }
}

export type VObjectAny = (VObjectNode | VObjectText) & VObjectInterface

export type VObject = Partial<VObjectText> &
  Partial<VObjectNode> &
  Partial<VObjectKeyedNode> &
  VObjectInterface

export type VObjectInterface = {
  create<T>(this: T): Element | Text
  replace<T>(this: T, parent: Element, child: Element | Text): void
}

//
//
// singletons
//
//

const touched = new Set<object>()

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
type ListKeysCache = SafeMap<object, ListKey>
const listKeysCache = new WeakMap() as SafeWeakMap<Node, ListKeysCache>

const hookCache = new WeakMap() as SafeWeakMap<
  VNode | VObject | VObjectText | VObjectNode,
  Partial<VHook>
>

//
//
// props
//
//

const createProp = (
  el: Element,
  doc: typeof xhtml,
  type: string,
  name: string,
  value: unknown,
  attrs: Record<string, Attr>
) => {
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
      ;(value as Any).current = el
      return

    // "value" and "checked" properties have to be set
    // directly on the element when it's an input to
    // properly diff later (see updateProps)
    case 'value':
    case 'checked':
      switch (type) {
        case 'input':
          ;(el as Any)[name] = value
          return
      }

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

  let node
  switch (typeof value) {
    case 'string':
    case 'number':
      el.setAttributeNode(
        (node = attrs[name] = doc.createAttribute.call(document, attr))
      )
      node.value = value as string
      return
    case 'function':
      el.setAttributeNode(
        (node = attrs[name] = doc.createAttribute.call(document, attr))
      )
      node.value = ''
      ;(el as Any)[attr] = value
      return
    case 'boolean':
      if (value) {
        el.setAttributeNode(
          (node = attrs[name] = doc.createAttribute.call(document, attr))
        )
        node.value = ''
      }
      return
    default:
      ;(el as Any)[name] = value
  }
}

const createProps = (
  el: Element,
  doc: typeof xhtml,
  type: string,
  props: Record<string, unknown>,
  attrs: Record<string, Attr> = {}
) => {
  for (const name in props) createProp(el, doc, type, name, props[name], attrs)
  propCache.set(el, { props, attrs })
}

const updateProps = (
  el: Element,
  doc: typeof xhtml,
  type: string,
  next: VProps
) => {
  if (!propCache.has(el)) return next && createProps(el, doc, type, next)

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
        // special cases
        switch (type) {
          case 'input':
            ;(el as Any)[name] !== value && ((el as Any)[name] = value)
            continue out
        }
    }

    // updated prop
    if (props[name] !== value) {
      if (typeof value === 'function') {
        const attr = name //toAttr[name] || name
        props[attr] = (el as Any)[attr] = value
      } else if (!(name in attrs)) (el as Any)[name] = value
    }
  }

  for (const name in attrs) {
    // removed attribute
    if (!(name in next) || next[name] === false) {
      el.removeAttributeNode(attrs[name])
      delete attrs[name]
      continue
    }

    // updated value
    if (props[name] !== (value = next[name]) && typeof value !== 'function')
      attrs[name].value = value as string
  }

  // created props
  for (const name in next)
    if (!(name in attrs) && !(name in props))
      createProp(el, doc, type, name, next[name], attrs)

  c.props = next
}

//
//
// expand vdom to their primitives
//
//

const expand = (
  v: VNode['children'] | VChild,
  doc = xhtml
): VObjectNode['children'] => {
  switch (typeof v) {
    case 'string':
    case 'number': {
      return [
        {
          create: createText,
          replace: replaceText,
          text: '' + v,
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
        } as VObject & VObjectText,
      ]
    }
  }

  if (Array.isArray(v)) {
    const result: VObjectNode['children'] = []
    for (let i = 0; i < v.length; i++) result.push(...expand(v[i], doc))
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
    const hook: Partial<VHook> = (current.hook = { vNode: v, doc })

    const vNode = (type as FunctionalComponent)({
      ...v.props,
      children: v.children,
    })

    // keep a pointer to the vNode data for later reactive partial updates
    hookCache.set(vNode, hook)

    // this is a weird situation.
    // we special case "key" because when "expanding" the
    // function it doesn't have knowledge of the parent "key".
    // that was lost one level up, but also the child vNode
    // shouldn't have knowledge of the above party, that would
    // introduce coupling.
    // we want to be able to create lists of arbitrary components
    // but they have to be given the "key" from the parent component
    // so this is what is happening here.
    if (v.props?.key != null) vNode.props = { key: v.props.key }

    return expand(vNode, doc)
  }

  switch (type) {
    case Fragment: {
      const children = expand(v.children, doc)
      if (hookCache.has(v)) hookCache.set(children[0], hookCache.get(v))
      return children
    }
    case 'svg': // svg namespace entry
      doc = svg
    default:
      if (v.props?.style) {
        if (typeof v.props.style === 'object') {
          v.props.style = toCssText(v.props.style as CSSStyleDeclaration)
        }
      }

      const vObject: VObjectNode = {
        create: createNode,
        replace: replaceNode,
        doc,
        type: type as string, // it's never symbol here we short circuit at Fragment ^
        props: v.props,
        children: expand(
          v.children,
          // svg namespace exodus
          (type === 'foreignObject' && xhtml) || doc
        ),
      }

      // inherit hook from initial vNode
      if (hookCache.has(v)) hookCache.set(vObject, hookCache.get(v))

      return [vObject as VObject & VObjectNode]
  }
}

//
//
// (v)dom methods
//
//

function createText(this: VObjectText) {
  return document.createTextNode(this.text)
}

function replaceText(
  this: VObjectText,
  parent: Element,
  child: Element | Text
) {
  setHookParentChild(this, parent, child)
  this.text !== child.nodeValue && (child.nodeValue = this.text)
  return
}

function createNode(this: VObjectNode) {
  const { doc, type, props, children } = this
  const child = doc.createElement.call(document, type)
  props && createProps(child, doc, type, props)
  if (children.keyed) attach(child, children as VObjectKeyedNode[])
  else
    for (let i = 0; i < children.length; i++)
      append(child, children[i] as VObjectAny)
  return child
}

function replaceNode(this: VObjectNode, parent: Element, child: Element) {
  if (child.nodeName.toUpperCase() !== this.type.toUpperCase()) {
    const newChild = this.create()
    setHookParentChild(this, parent, newChild)
    parent.replaceChild(newChild, child)
    return
  }

  // enable reactive updates final step
  setHookParentChild(this, parent, child)
  updateProps(child, this.doc, this.type, this.props)
  reconcile(child, this.children)
}

const append = (parent: Element, vNode: VObjectAny) => {
  const child = vNode.create()
  setHookParentChild(vNode, parent, child)
  parent.append(child)
  return child
}

//
//
// dom reconciliation algorithms
//
//

const attach = (el: Element, children: VObjectKeyedNode[]) => {
  const keys: ListKeysCache = new Map()
  for (let i = 0; i < children.length; i++) {
    const vNode = children[i]
    keys.set(vNode.props.key, {
      i,
      el: append(el, vNode as VObjectAny),
    } as ListKey)
  }
  listKeysCache.set(el, keys)
}

const reconcileList = (
  parent: Element,
  keys: ListKeysCache,
  next: VObjectKeyedNode[]
) => {
  touched.clear()

  for (let i = 0, left: Element; i < next.length; i++) {
    const vNode = next[i]

    const key = vNode.props.key
    touched.add(key)

    let child: Element

    if (!keys.has(key)) {
      // create
      child = vNode.create()

      keys.set(key, { i, el: child })
      // we know left has been assigned because we're i>0
      if (i) left!.after(child)
      else parent.prepend(child)
    } else {
      const item = keys.get(key)

      child = item.el

      // update
      updateProps(child, vNode.doc, vNode.type, vNode.props)
      reconcile(child, vNode.children)

      // move
      if (item.i > i) {
        item.i = i
        // we know left has been assigned because we're i>0
        if (i) left!.after(child)
        else parent.prepend(child)
      }
    }

    setHookParentChild(vNode, parent, child)

    left = child
  }

  for (const key of keys.keys()) {
    // remove
    if (!touched.has(key)) {
      parent.removeChild(keys.get(key).el)
      keys.delete(key)
    }
  }
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
    for (let i = prevLength; i < next.length; i++)
      append(parent, next[i] as VObjectAny)
  } else {
    for (let i = next.length; i < prevLength; i++)
      parent.removeChild(parent.lastChild!)
    for (let i = 0; i < next.length; i++) next[i].replace(parent, prev[i])
  }
}

//
//
// hooks
//
//

/**
 * Holds a reference to a hook that can be triggered
 * later using {@link trigger}.
 */
export const current: {
  hook: Partial<VHook> | null
} = { hook: null }

const setHookParentChild = (
  vNode: VObjectNode | VObjectText,
  parent: Element,
  child: Element | Text
) => {
  if (!hookCache.has(vNode)) return
  const hook = hookCache.get(vNode)
  hook.parent = parent
  hook.child = child
}

/**
 * Triggers a rerender on a hook.
 *
 * @param hook The hook to trigger
 */
export const trigger = (hook: VHook) => {
  const vNode = expand(hook.vNode, hook.doc)
  if (vNode.length > 1) reconcile(hook.parent, vNode)
  else vNode[0].replace(hook.parent, hook.child)
}

//
//
// entry point render vdom to dom element
//
//

/**
 * Renders a vNode on an html Element.
 *
 * @param vNode The virtual node to render
 * @param el The target element to render on
 */
export const render = (vNode: VNode, el: Element) => {
  reconcile(el, expand(vNode))
}
