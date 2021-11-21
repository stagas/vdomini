/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  h,
  Fragment,
  render,
  current,
  trigger,
  useHook,
  useCallback,
} from '../'

let c: any
beforeEach(() => (c = document.createElement('div')))

describe('hooks', () => {
  it('p', () => {
    let hook: any
    let content = 'foo'
    const Foo = () => {
      hook = current.hook
      return <p>{content}</p>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('foo')
    content = 'bar'
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('bar')
  })

  it('p inc a number', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <p>{i++}</p>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('1')
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('2')
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('3')
  })

  it('fragment top', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('1')
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('2')
    trigger(hook)
    expect(c.firstChild.textContent).toEqual('3')
  })

  it('fragment deep level 1', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        <Foo />
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div>0</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>1</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>2</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>3</div>')
  })

  it('fragment deep level 2', () => {
    let hook: any
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
      c
    )
    expect(c.innerHTML).toEqual('<div><p>0</p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p>1</p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p>2</p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p>3</p></div>')
  })

  it('fragment deep level 3', () => {
    let hook: any
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
      c
    )
    expect(c.innerHTML).toEqual('<div><p><b>0</b></p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p><b>1</b></p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p><b>2</b></p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p><b>3</b></p></div>')
  })

  it('fragment siblings (last)', () => {
    let hook: any
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
      c
    )
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>2</li></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>3</li></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>4</li></div>')
  })

  it('fragment siblings (first)', () => {
    let hook: any
    let i = 0
    const Foo = ({ id }: any) => {
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
      c
    )
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>2</li></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><li>3</li><li>1</li><li>2</li></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><li>4</li><li>1</li><li>2</li></div>')
  })

  it('fragment siblings (middle)', () => {
    let hook: any
    let i = 0
    const Foo = ({ id }: any) => {
      if (id === 2) hook = current.hook
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
      c
    )
    expect(c.innerHTML).toEqual('<div><li>0</li><li>1</li><li>2</li></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><li>0</li><li>3</li><li>2</li></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><li>0</li><li>4</li><li>2</li></div>')
  })

  it('fragment siblings (top last)', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        {[1, 2, 3].map(x => (
          <Foo key={x} />
        ))}
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div>012</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>013</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>014</div>')
  })

  it('fragment siblings (top first)', () => {
    let hook: any
    let i = 0
    const Foo = ({ id }: any) => {
      if (id === 1) hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        {[1, 2, 3].map(x => (
          <Foo key={x} id={x} />
        ))}
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div>012</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>312</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>412</div>')
  })

  it('fragment siblings (top middle)', () => {
    let hook: any
    let i = 0
    const Foo = ({ id }: any) => {
      if (id === 2) hook = current.hook
      return <>{i++}</>
    }
    render(
      <div>
        {[1, 2, 3].map(x => (
          <Foo key={x} id={x} />
        ))}
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div>012</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>032</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>042</div>')
  })

  it('multiple deep', () => {
    let hook_bar: any
    let hook_foo: any
    let i = 0
    const Bar = () => {
      hook_bar = current.hook
      return <b>{i++}</b>
    }
    const Foo = () => {
      hook_foo = current.hook
      return (
        <p>
          {i++}
          <Bar />
        </p>
      )
    }
    render(<Foo />, c)
    expect(c.innerHTML).toEqual('<p>0<b>1</b></p>')
    trigger(hook_bar)
    expect(c.innerHTML).toEqual('<p>0<b>2</b></p>')
    trigger(hook_foo)
    expect(c.innerHTML).toEqual('<p>3<b>4</b></p>')
    trigger(hook_bar)
    expect(c.innerHTML).toEqual('<p>3<b>5</b></p>')
  })

  it('deep and change', () => {
    let hook_bar: any
    let hook_foo: any
    let i = 0
    const Bar = () => {
      hook_bar = current.hook
      return <b>{i++}</b>
    }
    const Foo = () => {
      hook_foo = current.hook
      return <p>{i++}</p>
    }
    render(<Foo />, c)
    expect(c.innerHTML).toEqual('<p>0</p>')
    trigger(hook_foo)
    expect(c.innerHTML).toEqual('<p>1</p>')
    render(<Bar />, c)
    expect(c.innerHTML).toEqual('<b>2</b>')
    trigger(hook_bar)
    expect(c.innerHTML).toEqual('<b>3</b>')
  })

  it('fragment multiple', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return (
        <>
          {i++}
          {i++}
        </>
      )
    }
    render(<Foo />, c)
    expect(c.innerHTML).toEqual('01')
    trigger(hook)
    expect(c.innerHTML).toEqual('23')
    trigger(hook)
    expect(c.innerHTML).toEqual('45')
  })

  it('fragment multiple deep level 1', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return (
        <>
          {i++}
          {i++}
        </>
      )
    }
    render(
      <div>
        <Foo />
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div>01</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>23</div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div>45</div>')
  })

  it('fragment multiple deep level 2', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return (
        <>
          {i++}
          {i++}
        </>
      )
    }
    render(
      <div>
        <p>
          <Foo />
        </p>
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div><p>01</p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p>23</p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p>45</p></div>')
  })

  it.skip('fragment siblings multiple deep level 2', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return (
        <>
          {i++}
          {i++}
        </>
      )
    }
    render(
      <div>
        <p>
          {[1, 2, 3].map(x => (
            <Foo key={x} />
          ))}
        </p>
      </div>,
      c
    )
    expect(c.innerHTML).toEqual('<div><p>012345</p></div>')
    trigger(hook)
    expect(c.innerHTML).toEqual('<div><p>012367</p></div>')
  })

  it('fragment siblings multiple deep level 2 under element', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = current.hook
      return (
        <>
          {i++}
          {i++}
        </>
      )
    }
    render(
      <div>
        <p>
          {[1, 2, 3].map(x => (
            <li key={x}>
              <Foo key={x} />
            </li>
          ))}
        </p>
      </div>,
      c
    )
    expect(c.innerHTML).toEqual(
      '<div><p><li>01</li><li>23</li><li>45</li></p></div>'
    )
    trigger(hook)
    expect(c.innerHTML).toEqual(
      '<div><p><li>01</li><li>23</li><li>67</li></p></div>'
    )
  })

  it('useHook', () => {
    let hook: any
    let i = 0
    const Foo = () => {
      hook = useHook()
      return <p>{i++}</p>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    hook()
    expect(c.firstChild.textContent).toEqual('1')
    hook()
    expect(c.firstChild.textContent).toEqual('2')
  })

  it('useCallback', () => {
    let fn: any
    let i = 0
    const Foo = () => {
      fn = useCallback(() => i++)
      return <p>{i}</p>
    }
    render(<Foo />, c)
    expect(c.firstChild.textContent).toEqual('0')
    fn()
    expect(c.firstChild.textContent).toEqual('1')
    fn()
    expect(c.firstChild.textContent).toEqual('2')
  })
})
