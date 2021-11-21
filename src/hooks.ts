import { current, trigger, VHook } from './render'

export const useHook = () => {
  const hook = current.hook
  return () => trigger(hook as VHook)
}

export const useCallback = (fn: () => void) => {
  const hook = useHook()
  return () => {
    fn()
    hook()
  }
}
