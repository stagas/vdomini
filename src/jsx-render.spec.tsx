import { h } from './h'
import { render } from './render'

let c: HTMLDivElement
beforeEach(() => (c = document.createElement('div')))

describe('jsx + render', () => {
  it('works', () => {
    const i = 10
    const prop = 'foo'
    const v = (
      <div key={i}>
        <span className={prop}>{i}</span>
        and some text
        <img title="more" alt="to make it realistic" width="300" />
        <div>
          more
          <div style={{ color: 'blue' }}>
            nesting<div>!!!</div>
          </div>
        </div>
        <ul>
          {Array(2)
            .fill(0)
            .map((_, i: number) => (
              <li key={i}>{i}</li>
            ))}
        </ul>
      </div>
    )
    render(v, c)
    expect(c.innerHTML).toEqual(
      '<div><span class="foo">10</span>and some text<img title="more" alt="to make it realistic" width="300"><div>more<div style="color: blue;">nesting<div>!!!</div></div></div><ul><li>0</li><li>1</li></ul></div>',
    )
  })
})
