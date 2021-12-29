import { current, trigger, VHook, VNode } from './'
import type { SafeWeakMap } from './types'

const triggerHookCache = new WeakMap() as SafeWeakMap<VNode | Partial<VHook>, () => void>

/**
 * Returns a callback that will trigger
 * a rerender on the current component.
 *
 * ```tsx
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
  const hook = current.hook!
  if (triggerHookCache.has(hook)) return triggerHookCache.get(hook)
  const fn = () => trigger(hook as VHook)
  triggerHookCache.set(hook, fn)
  return fn
}

/**
 * Wraps a function along with a hook
 * so when called will also trigger that hook.
 *
 * ```tsx
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
export const useCallback = (fn: (...args: unknown[]) => void) => {
  const hook = useHook()
  return function (this: unknown, ...args: unknown[]) {
    const result = fn.apply(this, args)
    hook()
    return result
  }
}
