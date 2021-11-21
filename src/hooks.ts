import { current, trigger, VHook } from './render'

/**
 * Returns a callback that will trigger
 * a rerender on the current component.
 *
 * ```ts
 * let clicked = 0
 * const Foo = () => <>
 *   {clicked++}
 *   <button onclick={useHook()}>click me</button>
 * </>
 * ```
 *
 * @returns The hook callback
 */
export const useHook = () => {
  const hook = current.hook
  return () => trigger(hook as VHook)
}

/**
 * Wraps a function along with a hook
 * so when called will also trigger that hook.
 *
 * ```ts
 * let clicked = 0
 * const Foo = () => {
 *   const inc = useCallback(() => clicked++)
 *   return <>
 *     {clicked}
 *     <button onclick={inc}>click me</button>
 *   </>
 * }
 * ```
 *
 * @param fn Any function to wrap with the hook
 * @returns The callback function
 */
export const useCallback = (fn: () => void) => {
  const hook = useHook()
  return () => (fn(), hook())
}
