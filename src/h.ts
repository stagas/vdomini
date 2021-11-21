/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    // @ts-ignore
    export type Element = VNode

    // @ts-ignore
    export interface IntrinsicAttributes {
      key?: any
    }

    export interface IntrinsicElements {
      // @ts-ignore
      [k: string]: any
    }
  }
}

/**
 * The VNode type.
 */
export type VType =
  | FunctionalComponent
  | CustomElementConstructor
  | string
  | symbol

/**
 * VNode propeties.
 */
export type VProps = Record<string, unknown> | null | undefined

/**
 * A VNode child.
 */
export type VChild = VNode | string | number | boolean | undefined

/**
 * A virtual dom node.
 */
export interface VNode {
  type: VType
  props: VProps
  children: VChild[]
}

/**
 * Functional component interface.
 *
 * ```ts
 * const vNode = h(() => ({ type: 'p', props: null, children: ['hello'] }))
 * ```
 *
 * @param props The properties passed to the component
 * @returns The computed VNode.
 */
export interface FunctionalComponent {
  (props?: VProps): VNode
}

/**
 * Fragment symbol for JSX fragments <></>.
 */
export const Fragment = Symbol()

/**
 * The virtual node JSX factory. Returns the tree of the node and its children.
 *
 * ```tsx
 * const vNode = h('p', { align: 'center' }, ['hello', 'world'])
 * ```
 *
 * @param type The element type of the virtual node to be constructed.
 * @param props A props object with arbitrary values.
 * @param children A {@link VNode}.
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
