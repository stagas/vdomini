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

export type VType = FunctionalComponent | string | symbol
export type VProps = Record<string, unknown> | null | undefined
export type VChild = VNode | string | number | boolean | undefined

export interface VNode {
  type: VType
  props: VProps
  children: VChild[]
}

export interface FunctionalComponent {
  (props?: VProps): VNode
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
