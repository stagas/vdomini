import { toCssText, xhtml, svg } from './util'
import { Fragment } from './h'
import type {
  VNode,
  VNodeObject,
  VProps,
  VChild,
  FunctionalComponent,
} from './h'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any

// singletons

const touched = new Set<object>()

// caches

type PropCacheItem = {
  attrs: Record<string, Attr>
  props: Record<string, unknown>
}
const propCache = new WeakMap<object, PropCacheItem>()

type ListCacheItem = Map<object, { i: number; el: Element }>
const listCache = new WeakMap<Node, ListCacheItem>()

// props

const createProp = (
  el: Element,
  doc: typeof xhtml,
  type: string,
  name: string,
  value: unknown,
  attrs: Record<string, Attr>,
) => {
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
      attrs.style = el.getAttributeNode('style')!
      return
  }

  // create prop
  const attr = name //toAttr[name] || name
  let node
  switch (typeof value) {
    case 'string':
    case 'number':
      el.setAttributeNode(
        (node = attrs[name] = doc.createAttribute.call(document, attr)),
      )
      node.value = value as string
      return
    case 'function':
      el.setAttributeNode(
        (node = attrs[name] = doc.createAttribute.call(document, attr)),
      )
      node.value = ''
      ;(el as Any)[attr] = value
      return
    case 'boolean':
      if (value) {
        el.setAttributeNode(
          (node = attrs[name] = doc.createAttribute.call(document, attr)),
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
  attrs: Record<string, Attr> = {},
) => {
  for (const name in props) createProp(el, doc, type, name, props[name], attrs)
  propCache.set(el, { props, attrs })
}

const updateProps = (
  el: Element,
  doc: typeof xhtml,
  type: string,
  next: VProps,
) => {
  if (!propCache.has(el)) return next && createProps(el, doc, type, next)

  const c = propCache.get(el)!
  const { attrs, props } = c
  if (!next) {
    for (const name in attrs) el.removeAttributeNode(attrs[name])
    for (const name in props) delete el[name as keyof Element]
    propCache.delete(el)
    return
  }

  let value
  out: for (const name in props) {
    // removed prop
    if (!(name in next)) {
      delete el[name as keyof Element]
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

// expand vdom to their primitives

const expand = (
  vNode: VNode['children'] | VChild,
  doc = xhtml,
): VNodeObject['children'] => {
  switch (typeof vNode) {
    case 'string':
    case 'number':
      return [vNode.toString()]
    case 'boolean':
    case 'undefined':
      return ['']
  }

  if (Array.isArray(vNode)) {
    const result: VNodeObject['children'] = []
    for (let i = 0; i < vNode.length; i++) result.push(...expand(vNode[i], doc))
    result.keyed = (result[0] as VNode)?.props?.key != null
    return result
  }

  const type = vNode.type

  if (typeof type === 'function') {
    const v = (vNode.type as FunctionalComponent)({
      ...vNode.props,
      children: vNode.children,
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
    if (vNode.props?.key != null) v.props = { key: vNode.props.key }
    return expand(v, doc)
  }

  switch (type) {
    case Fragment:
      return expand(vNode.children, doc)
    case 'svg': // svg namespace entry
      doc = svg
    default:
      if (vNode.props?.style) {
        if (typeof vNode.props.style === 'object') {
          vNode.props.style = toCssText(
            vNode.props.style as CSSStyleDeclaration,
          )
        }
      }
      return [
        {
          doc,
          type,
          props: vNode.props,
          children: expand(
            vNode.children,
            // svg namespace exodus
            (type === 'foreignObject' && xhtml) || doc,
          ),
        } as VNodeObject,
      ]
  }
}

// (v)dom methods

const create = ({ doc, type, props, children }: VNodeObject) => {
  const child = doc.createElement.call(document, type)
  props && createProps(child, doc, type, props)
  if (children.keyed) attach(child, children)
  else for (let i = 0; i < children.length; i++) append(child, children[i])
  return child
}

const append = (el: Element, vNode: VNodeObject | string) => {
  const child = typeof vNode === 'string' ? vNode : create(vNode)
  el.append(child)
  return child
}

// TODO: this function has to be exposed in order for
// reactive programming to be possible with partial updates
const replace = (
  parent: Element,
  child: Element,
  vNode: VNodeObject | string,
) => {
  if (typeof vNode === 'string') {
    vNode !== child.nodeValue && (child.nodeValue = vNode)
    return
  }

  if (child.nodeName.toUpperCase() !== vNode.type.toUpperCase()) {
    parent.replaceChild(create(vNode), child)
    return
  }

  updateProps(child, vNode.doc, vNode.type, vNode.props)
  reconcile(child, vNode.children)
}

const attach = (el: Element, children: VNodeObject['children']) => {
  const keys: ListCacheItem = new Map()
  for (let i = 0; i < children.length; i++) {
    const vNode = children[i] as VNodeObject
    keys.set(vNode.props!.key as object, {
      i,
      el: append(el, vNode) as Element,
    })
  }
  listCache.set(el, keys)
}

// dom reconciliation algorithm

const reconcile = (parentEl: Element, next: VNodeObject['children']) => {
  if (listCache.has(parentEl)) {
    touched.clear()
    const keys = listCache.get(parentEl)!

    for (let i = 0, left: Element; i < next.length; i++) {
      const vNode = next[i] as VNodeObject

      const key = vNode.props!.key as object
      touched.add(key)

      let el: Element
      if (!keys.has(key)) {
        // create
        el = create(vNode)
        keys.set(key, { i, el })
        if (i) left!.after(el)
        else parentEl.prepend(el)
      } else {
        const item = keys.get(key)!
        el = item.el

        // update
        updateProps(el, vNode.doc, vNode.type, vNode.props)
        reconcile(el, vNode.children)

        // move
        if (item.i > i) {
          item.i = i
          if (i) left!.after(el)
          else parentEl.prepend(el)
        }
      }
      left = el
    }

    for (const key of keys.keys()) {
      // remove
      if (!touched.has(key)) {
        parentEl.removeChild(keys.get(key)!.el)
        keys.delete(key)
      }
    }

    return
  } else if (next.keyed) {
    attach(parentEl, next)
    return
  }

  const prev = parentEl.childNodes as NodeListOf<Element>
  const prevLength = prev.length

  if (next.length >= prevLength) {
    for (let i = 0; i < prevLength; i++) replace(parentEl, prev[i], next[i])
    for (let i = prevLength; i < next.length; i++) append(parentEl, next[i])
  } else {
    for (let i = next.length; i < prevLength; i++)
      parentEl.removeChild(parentEl.lastChild!)
    for (let i = 0; i < next.length; i++) replace(parentEl, prev[i], next[i])
  }
}

// entry point render vdom to dom element

export const render = (vNode: VNode, el: Element) =>
  reconcile(el, expand(vNode))
