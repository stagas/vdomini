import type { VNode } from './' // * as vdom from './vdom.ts'

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

export const Fragment = Object.create(null) //{} //Symbol.for('Fragment')

export const create = <T>(v: VNode<T> | string) => {
  if (typeof v === 'string' || typeof v === 'number') {
    return document.createTextNode(v)
  } else if (v.tag === Fragment) {
    return document.createDocumentFragment()
  } else if (typeof v.tag === 'string') {
    // TODO: NS vs normal should be determined on the parent node they belong
    // const tag = toTag(v.tag, props)
    const tag = v.tag
    return SVG.includes(tag)
      ? document.createElementNS('http://www.w3.org/2000/svg', tag)
      : document.createElement(tag)
  } else {
    // TODO: we could always return a Fragment instead of throwing?
    throw new TypeError(
      'Unknown VNode type: ' + typeof v + '\n' + JSON.stringify(v), // TODO: printify v
    )
  }
}

const isEventProp = (name: string) => name.startsWith('on')

const addEventListener = (
  el: HTMLElement,
  name: keyof HTMLElementEventMap,
  listener: EventListener,
) => el.addEventListener(name, listener)

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
    // TODO: name here is camelCase, we need kebab-case
    if (typeof value === 'string' || typeof value === 'number') {
      // if attribute has changed
      if (el.getAttribute(name) !== value) {
        el.setAttribute(name, value)
      }
    } else if (typeof value === 'boolean') {
      // TODO: check if attribute has changed instead of always setting it?
      if (value) {
        el.setAttribute(name, '') // empty string means attribute on (true)
      } else {
        el.removeAttribute(name) // attribute false means we remove the attribute
      }
    } else {
      // it's an arbitrary property so set it (must be camelCased)
      // TODO: type 'name' here somehow?
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(el as any)[name] = value
    }
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
      updateAttribute(el, name, value as string)
    }

  // remove any attributes that are not in props
  for (const { name } of Array.from(el.attributes ?? [])) {
    // node.attributes are camelCase qualified
    // TODO: name needs to be camelCase qualified here
    if (!v.props || !(name in v.props)) {
      // TODO: but here we need the kebab-case name
      el.removeAttribute(name)
      // TODO: examine if below cases are needed
      // delete node[name]
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

export const render = <T>(
  el: HTMLElement,
  v: VNode<T>,
  // props: vdom.Props = {},
) =>
  reconcile(
    el,
    v.tag === Fragment ? v : { tag: Fragment, props: null, children: [v] },
    // props,
  )

const reconcile = <T>(
  currentEl: Node,
  v: VNode<T>,
  // props: vdom.Props = {},
) => {
  const prev = currentEl.childNodes //as NodeListOf<HTMLElement>
  const next = v.children

  while (prev.length > next.length) {
    currentEl.removeChild(currentEl.lastChild!) // as Node)
  }

  // TODO: here the entry might be: VNode[] | VNode | string | number | boolean
  //       and so needs a recursive algorithm and not a flat iteration
  for (const [i, child] of next.entries() as IterableIterator<
    [number, VNode<unknown>]
  >) {
    let el = prev[i] as ValidElement //as HTMLElement //& Context

    if (!el) {
      currentEl.appendChild(
        (el = create(child)), // as HTMLElement & Context),
      )
    } else if (
      !child.tag ||
      (typeof child.tag === 'string' &&
        // TODO: this conditional is too fragile, some better way?
        // node.tagName !== toTag(child.tag, props).toUpperCase()
        el.nodeName !== child.tag.toUpperCase()) // TODO: Map<nodeName, upperCaseNodeName>()
      // el.tagName !== child.tag.toUpperCase()
      // el.nodeName
    ) {
      currentEl.replaceChild(
        // TODO: can text be used for replaceChild?
        (el = create(child)), // as HTMLElement & Context),
        prev[i],
      )
    }

    update(el as HTMLElement, child)

    if (child.children) reconcile(el, child)
  }
}
