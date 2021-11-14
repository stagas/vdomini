/**
 * VTag.
 */
export type VTag<T> = T

// /**
//  * VProps.
//  */
// export type VProps = Record<string, unknown> | null

/**
 * VChildren.
 */
export type VChildren = (VNode<unknown> | string)[]

/**
 * VNode.
 */
export type VNode<P> = {
  type: string | VFactory
  props?: P
  children: VChildren
}

export type VFactory = <P>(props?: P) => VNode<unknown>

/**
 * The virtual node factory. Returns the tree of the node and its children.
 *
 * @param tag The node's tag. `lowercase`-first tags become strings,
 *  `Uppercase`-first are passed by reference.
 * @param props Props object, `kebab-case` keys are converted to `camelCase`.
 * @param children The children nodes.
 */
export const h = <P>(
  type: string | VFactory,
  props?: P,
  ...children: VChildren
): VNode<P> => ({
  type,
  props,
  children,
})

// declare const h: React.createElement
