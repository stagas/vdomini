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
        c,
      )
      const lis: any = Array.from(c.childNodes)
      expect(lis[0].nodeName).toEqual('LI')
      render(
        <>
          {[0, 1, 2, 3].map(x => (
            <Foo key={x} />
          ))}
        </>,
        c,
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
        c,
      )
      const lis: any = Array.from(c.childNodes)
      expect(lis[0].nodeName).toEqual('LI')
      render(
        <>
          {[0, 1, 2, 3].map(x => (
            <Foo key={x} value={x} />
          ))}
        </>,
        c,
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
})
