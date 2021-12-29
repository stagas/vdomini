// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

export interface SafeMap<K extends object, T> extends Map<K, T> {
  has(v: K): boolean
  get(v: K): T
}

export interface SafeWeakMap<K extends object, T> extends WeakMap<K, T> {
  has(v: K): boolean
  get(v: K): T
}
