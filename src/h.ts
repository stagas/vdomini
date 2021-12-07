/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as jsx from 'html-jsx'

declare module 'html-jsx' {
  interface DOMAttributes<T> extends JSX.IntrinsicAttributes {}
}

declare global {
  namespace JSX {
    /**
     * The type returned by our `createElement` factory.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    type Element = VNode

    interface IntrinsicElements extends jsx.IntrinsicElements {
      /**
       * This allows for any tag to be used.
       * @private
       */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [k: string]: unknown
    }

    interface IntrinsicAttributes {
      /**
       * Pass an object that will be assigned the DOM element reference in its `current` property.
       * @private
       */
      ref?: {
        current?: HTMLElement | SVGElement
      }
      /**
       * List index key - each item's `key` must be unique.
       * @private
       */
      key?: string | number
    }

    interface HTMLAttributes<T> extends jsx.HTMLAttributes<T> {}
    interface SVGAttributes<T> extends jsx.SVGAttributes<T> {}
    interface DOMAttributes<T> extends jsx.DOMAttributes<T> {}
  }
}

/**
 * The VNode type.
 */
export type VType = FunctionalComponent | CustomElementConstructor | string | symbol

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
export const h = (type: VNode['type'], props?: VNode['props'], ...children: VNode['children']): VNode => ({
  type,
  props,
  children,
})
