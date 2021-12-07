/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, Fragment, render } from '../'

let c: any
beforeEach(() => (c = document.createElement('div')))

describe('jsx', () => {
  it('function w/keyed children', () => {
    const Foo = () => <li></li>
    {
      render(
        <>
          {[1, 2, 3].map(x => (
            <Foo key={x} />
          ))}
        </>,
        c
      )
      const lis: any = Array.from(c.childNodes)
      expect(lis[0].nodeName).toEqual('LI')
      render(
        <>
          {[0, 1, 2, 3].map(x => (
            <Foo key={x} />
          ))}
        </>,
        c
      )
      const res: any = Array.from(c.childNodes)
      expect(res[1]).toBe(lis[0])
    }
  })

  it('function w/keyed children and value', () => {
    const Foo = ({ value }: any) => <li>{value}</li>
    {
      render(
        <>
          {[1, 2, 3].map(x => (
            <Foo key={x} value={x} />
          ))}
        </>,
        c
      )
      const lis: any = Array.from(c.childNodes)
      expect(lis[0].nodeName).toEqual('LI')
      render(
        <>
          {[0, 1, 2, 3].map(x => (
            <Foo key={x} value={x} />
          ))}
        </>,
        c
      )
      const res: any = Array.from(c.childNodes)
      expect(res[1]).toBe(lis[0])
      expect(res[2]).toBe(lis[1])
      expect(res[3]).toBe(lis[2])
      expect(res[0].textContent).toEqual('0')
      expect(res[1].textContent).toEqual('1')
      expect(res[2].textContent).toEqual('2')
      expect(res[3].textContent).toEqual('3')
    }
  })

  it('complex case 2', () => {
    let i = 10

    const prop = 'foo'
    const onClick = () => {
      /* void */
    }
    const randomly = () => Math.random() - 0.5

    const factory = () => (
      <div key={i}>
        <span class={prop}>{i}</span>
        and some text
        <input autofocus={i % 5 === 0} type="text" />
        <img crossorigin="anonymous" title="more" alt="to make it realistic" width="300" />
        <div>
          more
          <a>hey</a>
          <>
            {Array(count * 2 - i * 2)
              .fill(0)
              .map((_, i: number) => (
                <div key={i}>
                  nesting<div>!!!</div>
                </div>
              ))
              .sort(randomly)}
          </>
        </div>
        <ul>
          {Array(i * 2)
            .fill(0)
            .map((_, ii: number) => (
              <li
                key={ii}
                onclick={i % 5 === 0 ? onClick : undefined}
                style={
                  i % 3 !== 0
                    ? {
                        width: '200px',
                        height: '50px',
                        color: 'blue',
                        background: 'red',
                        overflow: 'hidden',
                      }
                    : { height: '250px', color: 'blue' }
                }
              >
                {i}
              </li>
            ))
            .sort(randomly)}
        </ul>
      </div>
    )

    const count = 10
    for (i = 0; i < count; i++) {
      render(factory(), c)
      expect(c.firstChild.nodeName).toEqual('DIV')
    }
  })

  it('pass props correctly to children', () => {
    let i = 0
    const Foo = () => {
      return <div class={i % 2 === 0 ? 'yes' : 'no'}>{i++}</div>
    }
    render(
      <>
        {[1, 2, 3].map(x => (
          <Foo key={x} />
        ))}
      </>,
      c
    )
    expect(c.innerHTML).toEqual('<div class="yes">0</div><div class="no">1</div><div class="yes">2</div>')
    render(
      <>
        {[4, 5, 6].map(x => (
          <Foo key={x} />
        ))}
      </>,
      c
    )
    expect(c.innerHTML).toEqual('<div class="no">3</div><div class="yes">4</div><div class="no">5</div>')
  })

  it('replaces an element node with a text node', () => {
    render(
      <>
        {false}
        <p>world</p>
      </>,
      c
    )

    render(
      <>
        <p>hello</p>
        {false}
        <p>world</p>
      </>,
      c
    )

    expect(c.innerHTML).toEqual('<p>hello</p><p>world</p>')
  })

  it('replaces text nodes properly', () => {
    render(
      <>
        {'foo'}
        {'bar'}
      </>,
      c
    )

    render(
      <>
        {'zoo'}
        {'foo'}
        {'bar'}
      </>,
      c
    )

    expect(c.innerHTML).toEqual('zoofoobar')
  })
})
