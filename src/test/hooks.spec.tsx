/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, Fragment, render, current, trigger } from '../'
import { VHook } from '../h'

let c: any
beforeEach(() => (c = document.createElement('div')))

describe.skip('hooks', () => {
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

  it.only('fragment top', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    trigger(hook!)
    debugger
    expect(c.firstChild.textContent).toEqual('1')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('2')
    trigger(hook!)
    expect(c.firstChild.textContent).toEqual('3')
  })

  it('fragment deep level 1', () => {
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
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div>1</div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div>2</div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div>3</div>')
  })

  it('fragment deep level 2', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        <p>
          <Foo />
        </p>
      </div>,
      c,
    )
    expect(c.innerHTML).toEqual('<div><p>0</p></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><p>1</p></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><p>2</p></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><p>3</p></div>')
  })

  it('fragment deep level 3', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        <p>
          <b>
            <Foo />
          </b>
        </p>
      </div>,
      c,
    )
    expect(c.innerHTML).toEqual('<div><p><b>0</b></p></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><p><b>1</b></p></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><p><b>2</b></p></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><p><b>3</b></p></div>')
  })

  it('fragment siblings (last)', () => {
    let hook: VHook | null
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        {[1, 2, 3].map(x => (
          <li key={x}>
            <Foo />
          </li>
        ))}
      </div>,
      c,
    )
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>2</li></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>3</li></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>4</li></div>')
  })

  it('fragment siblings (first)', () => {
    let hook: VHook | null
    let i = 0
    const Foo = ({ id }) => {
      if (id === 1) hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        {[1, 2, 3].map(x => (
          <li key={x}>
            <Foo id={x} />
          </li>
        ))}
      </div>,
      c,
    )
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>2</li></div>')
    trigger(hook!)
    debugger
    expect(c.innerHTML).toEqual('<div><li>3</li><li>1</li><li>2</li></div>')
    trigger(hook!)
    expect(c.innerHTML).toEqual('<div><li>4</li><li>1</li><li>2</li></div>')
  })
})
