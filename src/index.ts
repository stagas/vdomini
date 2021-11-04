import { camelCase } from './util'

const propsToCamelCase = (props: VProps) =>
  props
    ? Object.fromEntries(
        Object.entries(props).map(([key, value]) => [camelCase(key), value])
      )
    : null

/**
 * VTag.
 */
export type VTag<T> = T

/**
 * VProps.
 */
export type VProps = Record<string, unknown> | null

/**
 * VChildren.
 */
export type VChildren = (VNode<unknown> | string)[]

/**
 * VNode.
 */
export type VNode<T> = { tag: T; props?: VProps; children: VChildren }

/**
 * The virtual node factory. Returns the tree of the node and its children.
 *
 * @param tag The node's tag. `lowercase`-first tags become strings,
 *  `Uppercase`-first are passed by reference.
 * @param props Props object, `kebab-case` keys are converted to `camelCase`.
 * @param children The children nodes.
 */
export const h = <T>(
  tag: T,
  props: VProps,
  ...children: VChildren
): VNode<T> => ({
  tag,
  props: propsToCamelCase(props),
  children: children.flat()
})
