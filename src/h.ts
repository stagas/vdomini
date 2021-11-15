declare global {
  namespace JSX {
    export interface IntrinsicElements {
      [k: string]: any
    }
  }
}

export type Element =
  | FunctionalComponent
  | CustomElementConstructor
  | typeof Fragment
  | string
  | undefined
  | null

export interface VNode {
  type: Element
  props: Record<string, unknown> | null | undefined
  children: (VNode | string | number | boolean | null | undefined)[]
}

export interface FunctionalComponent {
  (props?: any): VNode
}

export const Fragment = Symbol()

/**
 * The virtual node JSX factory. Returns the tree of the node and its children.
 *
 * @param type The element type of the virtual node to be constructed.
 * @param props A props object with arbitrary values.
 * @param children The children of the virtual node.
 */
export const h = (
  type: VNode['type'],
  props?: VNode['props'],
  ...children: VNode['children']
): VNode => ({
  type,
  props,
  children,
})
