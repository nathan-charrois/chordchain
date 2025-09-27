export type Callback<T> = (value: T) => void

export function pubSub<T>() {
  const listeners = new Set<Callback<T>>()

  return {
    subscribe: (cb: Callback<T>) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    publish: (value: T) => {
      listeners.forEach(cb => cb(value))
    },
  }
}
