import { h, Fragment, render, useCallback } from 'vdomini'

let count = 0

const Counter = () => {
  const inc = useCallback(() => count++)
  const dec = useCallback(() => count--)
  return (
    <>
      count is: {count}
      <br />
      <button onclick={inc}>increase</button>
      <button onclick={dec}>decrease</button>
    </>
  )
}

render(<Counter />, document.body)
