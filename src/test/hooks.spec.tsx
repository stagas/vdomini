/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, Fragment, render, current, trigger } from '../'
import { VHook } from '../h'

let c: any
beforeEach(() => (c = document.createElement('div')))

describe('hooks', () => {
  it('p', () => {
    let hook: VHook | null
    let content = 'foo'
    const Foo = () => {
      hook = current.hook
      return <p>{content}</p>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('foo')
    content = 'bar'
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('bar')
  })

  it('p inc a number', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <p>{i++}</p>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('1')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('2')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('3')
  })

  it('fragment top', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('1')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('2')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('3')
  })

  it('fragment deep', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        <Foo />
      </div>,
      c,
    )
    expect(c.innerHTML).toEqual('<div>0</div>')
    debugger
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div>1</div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div>2</div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div>3</div>')
  })
})
