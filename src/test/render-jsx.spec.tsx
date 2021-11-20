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
    const i = 10
    const prop = 'foo'
    const onClick = () => {
      /* void */
    }

    const randomly = () => Math.random() - 0.5

    const count = 10
    const v = (
      <div key={i} randomattr={i}>
        <span className={prop}>{i}</span>
        and some text
        <input autoFocus={i % 5 === 0} type="text" />
        <img
          crossOrigin="anonymous"
          title="more"
          alt="to make it realistic"
          width="300"
        />
        <div>
          more
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
                onClick={i % 5 === 0 ? onClick : null}
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
    render(v, c)
    expect(c.firstChild.nodeName).toEqual('DIV')
  })
})
