import { h, Fragment, render, useHook } from 'vdomini'

let clicked = 0
const Foo = () => (
  <>
    {clicked++}
    <button onclick={useHook()}>click me</button>
  </>
)

render(<Foo />, document.body)
