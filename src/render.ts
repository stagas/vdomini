/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from './h'
import { html } from 'property-information'
// import { htmlEventAttributes } from 'html-event-attributes'

const toAttr = Object.fromEntries([
  ...Object.entries(html.property).map(([key, value]) => [
    key,
    value.attribute,
  ]),
  ...Object.entries(html.normal).map(([key, value]) => [
    key,
    html.property[value].attribute,
  ]),
])

const toProp = Object.fromEntries([
  ...Object.entries(html.property).map(([key, value]) => [key, value.property]),
  ...Object.entries(html.normal).map(([key, value]) => [key, value]),
])

// const eventProp = Object.fromEntries([
//   ...htmlEventAttributes.map(key => [toProp[key], true]),
//   ...htmlEventAttributes.map(key => [key, true]),
// ])

const createElement = document.createElement.bind(document)
const createElementSvg = document.createElementNS.bind(
  document,
  'http://www.w3.org/2000/svg',
)

// type ValidElement = HTMLElement | Text | DocumentFragment | SVGElement

const createAttrs = (el: any, props: any) => {
  for (const name in props) {
    const value = props[name]

    // special cases
    switch (name) {
      case 'key':
        el.key = value
        continue
      case 'style':
        Object.assign(el.style, value)
        continue
    }

    // regular attributes
    const attr = name in toAttr ? toAttr[name] : name
    switch (typeof value) {
      case 'string':
      case 'number':
        el.setAttribute(attr, value as string)
        continue
      case 'function':
        el.setAttribute(attr, '')
        el[attr] = value
        continue
      case 'boolean':
        if (value) el.setAttribute(attr, '')
        continue
      default:
        // anything else just put in the object
        // it can be examined afterwards with Object.keys()
        el[name] = value
        continue
    }
  }
}

const updateAttrs = (el: any, props: any) => {
  if (!props) {
    // remove intrinsic attributes
    for (let i = 0, attrs = el.attributes, len = attrs.length; i < len; i++)
      el.removeAttributeNode(attrs[i])

    // remove prop keys we added with el[key]
    for (let i = 0, keys = Object.keys(el), len = keys.length; i < len; i++)
      delete el[keys[i]]
  } else {
    // remove intrinsic attributes not in props
    for (let i = 0, attrs = el.attributes, len = attrs.length; i < len; i++) {
      const attrNode = attrs[i]
      const name = attrNode.name
      if (!(toProp[name] in props) && !(name in props))
        el.removeAttributeNode(attrNode)
    }

    // also for prop values
    for (let i = 0, keys = Object.keys(el), len = keys.length; i < len; i++)
      if (!(keys[i] in props)) delete el[keys[i]]
  }

  for (const name in props) {
    const value = props[name]

    // special cases
    switch (name) {
      case 'key':
        el.key = value
        continue
      case 'style':
        Object.assign(el.style, value)
        continue
    }

    const attr = name in toAttr ? toAttr[name] : name

    switch (typeof value) {
      case 'string':
      case 'number':
        el.setAttribute(attr, value as string)
        continue
      case 'function':
        // the line below is magic, when the attribute is removed
        // with removeAttribute it will remove the handler as well
        // because that's how the dom does it for prop event listeners.
        el.setAttribute(attr, '')
        el[attr] = value
        continue
      case 'boolean':
        if (value) el.setAttribute(attr, '')
        else el.removeAttribute(attr)
        continue
      default:
        el[name] = value
        continue
    }
  }
}

export const render = (vNode: any, el: any) => reconcile(el, expand(vNode))

const expand = (vNode: any, create: any = createElement): any => {
  if (typeof vNode === 'string' || typeof vNode === 'number')
    return [vNode.toString()]

  if (Array.isArray(vNode)) {
    const result: any = []
    for (let i = 0; i < vNode.length; i++)
      result.push(...expand(vNode[i], create))
    return result
  }

  const type = vNode.type

  if (typeof type === 'function')
    return expand(
      vNode.type({ ...vNode.props, children: vNode.children }),
      create,
    )

  switch (type) {
    case Fragment:
      return expand(vNode.children, create)
    case 'svg':
      create = createElementSvg
    default:
      return [
        {
          create,
          type: type.toUpperCase(),
          props: vNode.props,
          children: expand(vNode.children, create),
        },
      ]
  }
}

const create = ({ create, type, props, children }: any) => {
  const child = create(type)
  props && createAttrs(child as HTMLElement, props)
  for (let i = 0; i < children.length; i++) append(child, children[i])
  return child
}

const replace = (parentEl: Node, prevEl: Node, vNode: any) => {
  if (typeof vNode === 'string') {
    prevEl.textContent = vNode
    return
  }

  if (prevEl.nodeName !== vNode.type) {
    parentEl.replaceChild(create(vNode), prevEl)
    return
  }

  updateAttrs(prevEl as HTMLElement, vNode.props)
  if (vNode.children) reconcile(prevEl, vNode.children)
}

const append = (parentEl: Node, vNode: any) =>
  parentEl.appendChild(
    (typeof vNode === 'string' && document.createTextNode(vNode)) ||
      create(vNode),
  )

const reconcile = (parentEl: Node, next: any) => {
  const prev = parentEl.childNodes
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
