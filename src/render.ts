import type { VNode } from './' // * as vdom from './vdom.ts'
import { html } from 'property-information'

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
  ...Object.entries(html.normal).map(([key, value]) => [
    key,
    value, //html.property[value].property,
  ]),
])

// import { Uid, kebabCase, camelCase } from './util.ts'

// export const elementRegistry: Map<typeof HTMLElement, string> = new Map()
// export const aliasMap: Map<string, string> = new Map()

// export const getTag = (ctor: typeof HTMLElement | string, alias?: string) => {
//   if (typeof ctor === 'string') return ctor

//   let tag = elementRegistry.get(ctor)

//   if (!tag) {
//     tag = Uid(ctor.name)
//     customElements.define(tag, ctor)
//     elementRegistry.set(ctor, tag)
//     aliasMap.set(tag, alias as string)
//   }

//   return tag
// }

// const toTag = (tag: vdom.Tag, props: vdom.Props) =>
//   getTag(
//     ('string' === typeof tag &&
//       /^[A-Z]/.test(tag) &&
//       props &&
//       (props[tag] as typeof HTMLElement)) ||
//       tag,
//     tag as string,
//   )

const SVG = ['svg', 'path', 'rect', 'circle'] // TODO: complete this

type ValidElement = HTMLElement | Text | DocumentFragment | SVGElement

export const Fragment = Object.create(null)

export const create = <T>(v: VNode<T> | string): ValidElement => {
  if (typeof v === 'string' || typeof v === 'number') {
    return document.createTextNode(v)
    // } else if (v.type === Fragment) {
    //   return document.createDocumentFragment()
  } else if (typeof v.type === 'string') {
    // TODO: NS vs normal should be determined on the parent node they belong
    // const tag = toTag(v.type, props)
    const tag = v.type
    return SVG.includes(tag)
      ? document.createElementNS('http://www.w3.org/2000/svg', tag)
      : document.createElement(tag)
    // } else if (typeof v.type === 'function') {
    //   // const fragment = document.createDocumentFragment()
    //   // debugger
    //   // render(fragment,
    //   return create(v.type({ ...v.props, children: v.children }))
    //   // {
    //   //   type: Fragment,
    //   //   props: null,
    //   //   children: [],
    //   // })
    //   // return fragment
  } else {
    // TODO: we could always return a Fragment instead of throwing?
    throw new TypeError(
      'Unknown VNode type "' + typeof v + '": ' + JSON.stringify(v), // TODO: printify v
    )
  }
}

// TODO: replace this with a map
const isEventProp = (name: string) => name.startsWith('on')

// TODO: event names maps and properly type this
const addEventListener = (
  el: HTMLElement,
  name: string, //keyof HTMLElement, //HTMLElementEventMap,
  listener: EventListener,
) => {
  const attr = toAttr[name]
  el.setAttribute(attr, '') // this allows for removal
  ;(el as HTMLElement & Record<string, EventListener>)[attr] = listener //.addEventListener(name, listener)
}

const updateAttribute = (
  el: HTMLElement,
  name: string,
  value: string | EventListener,
) => {
  if (isEventProp(name)) {
    addEventListener(
      el,
      name as keyof HTMLElementEventMap,
      value as EventListener,
    )
  } else {
    const attr = toAttr[name]
    if (attr) {
      if (typeof value === 'string' || typeof value === 'number') {
        // if attribute has changed
        if (el.getAttribute(toAttr[name]) !== value) {
          el.setAttribute(toAttr[name], value)
        }
      } else if (typeof value === 'boolean') {
        // TODO: check if attribute has changed instead of always setting it?
        if (value) {
          el.setAttribute(toAttr[name], '') // empty string means attribute on (true)
        } else {
          el.removeAttribute(toAttr[name]) // attribute false means we remove the attribute
        }
        return
      }
    }

    // it's an arbitrary property so set it (must be camelCased)
    // TODO: type 'name' here somehow?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(el as any)[toProp[name] ?? name] = value
  }
  // if (name.startsWith('on')) {
  //   if (typeof value === 'string') {
  //     const fn = new Function('event', 'props', `with (props) { ${value} }`)
  //     node[name] = function (event: Event) {
  //       return fn.call(this, event, props)
  //     }
  //   } else {
  //     node[name] = value
  //   }
  // } else {
  // if (typeof value === 'string' || typeof value === 'number') {
  //   if (node.getAttribute(kebabCase(name)) !== value) {
  //     node.setAttribute(kebabCase(name), value as string)
  //   }
  // } else if (typeof value === 'boolean') {
  //   if (value) {
  //     node.setAttribute(kebabCase(name), '')
  //   } else {
  //     node.removeAttribute(kebabCase(name))
  //   }
  // } else {
  //   node[camelCase(name)] = value
  // }
  // }
}

const update = <T>(el: HTMLElement, v: VNode<T>) => {
  // update attributes from the props we received
  if (v.props)
    for (const [name, value] of Object.entries(v.props)) {
      updateAttribute(el, name, value)
    }

  // remove any attributes that are not in props
  // TODO: the ?? [] conditional is for Text nodes which dont have attributes
  // bench if this is faster or a typeof/instanceof check is better here
  for (const { name } of Array.from(el.attributes ?? [])) {
    // node.attributes are camelCase qualified
    // TODO: name needs to be camelCase qualified here
    if (
      !v.props ||
      (!(toProp[name] in v.props) && !(toAttr[name] in v.props))
    ) {
      // debugger
      // TODO: but here we need the kebab-case name
      // throw name
      el.removeAttribute(name) //P[name].attribute)
      // TODO: examine if below cases are needed
      // delete el[name]
      // node[name] = null
    }
    // if (!v.props || !(camelCase(name) in v.props)) {
    //   node.removeAttribute(kebabCase(name))
    //   // TODO: examine if below cases are needed
    //   // delete node[name]
    //   // node[name] = null
    // }
  }
}

export type Context = Record<string, unknown>

export const render = <T>(el: ValidElement, v: VNode<T>) =>
  reconcile(
    el,
    // v.type === Fragment ? v : // TODO: do we need this optimization?
    { type: null, props: null, children: expand(v) },
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const expand = (vNode: any): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = []

  if (Array.isArray(vNode)) {
    for (const child of vNode) {
      result.push(...expand(child))
    }
  } else if (vNode.type === Fragment) {
    result.push(...expand(vNode.children))
  } else if (typeof vNode === 'string') {
    result.push(vNode)
  } else if (typeof vNode.type === 'function') {
    result.push(
      ...expand(vNode.type({ ...vNode.props, children: vNode.children })),
    )
  } else {
    result.push({
      type: vNode.type,
      props: vNode.props,
      children: expand(vNode.children),
    })
  }

  return result
}

const reconcile = <T>(
  currentEl: Node,
  currentVNode: VNode<T>,
  // props: vdom.Props = {},
) => {
  const prev = currentEl.childNodes //as NodeListOf<HTMLElement>
  const next = currentVNode.children

  // TODO: this is wrong as it doesn't expand Fragment children?
  // also doesn't handle arrays
  while (prev.length > next.length) {
    currentEl.removeChild(currentEl.lastChild!) // as Node)
  }

  // TODO: here the entry might be: VNode[] | VNode | string | number | boolean
  //       and so needs a recursive algorithm and not a flat iteration
  for (const [i, vNode] of next.entries() as IterableIterator<
    [number, VNode<unknown>]
  >) {
    let el = prev[i] as ValidElement //as HTMLElement //& Context

    if (!el) {
      el = create(vNode)
      update(el as HTMLElement, vNode)
      if (vNode.children) reconcile(el, vNode)

      currentEl.appendChild(el)
      // (el = create(child)), // as HTMLElement & Context),
      // )
      // debugger
    } else if (
      !vNode.type || // <- this reconciles text elements (should it be typeof/instanceof?)
      (typeof vNode.type === 'string' &&
        // TODO: this conditional is too fragile, some better way?
        // node.tagName !== toTag(child.tag, props).toUpperCase()
        el.nodeName !== vNode.type.toUpperCase()) // TODO: Map<nodeName, upperCaseNodeName>()
      // el.tagName !== child.tag.toUpperCase()
      // el.nodeName
    ) {
      el = create(vNode)
      update(el as HTMLElement, vNode)
      if (vNode.children) reconcile(el, vNode)

      currentEl.replaceChild(el, prev[i])
      // TODO: can text be used for replaceChild?
      // (el = create(child)), // as HTMLElement & Context),
      // prev[i],
      // )
    } else {
      update(el as HTMLElement, vNode)
      if (vNode.children) reconcile(el, vNode)
    }

    // update(el as HTMLElement, child)

    // if (child.children) reconcile(el, child)
  }
}
