import { Fragment } from './h'
import { render } from './render'

let c: HTMLDivElement
beforeEach(() => (c = document.createElement('div')))

describe('render(v, el)', () => {
  it('p', () => {
    render({ type: 'p', props: null, children: [] }, c)
    expect(c.outerHTML).toEqual('<div><p></p></div>')
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('svg', () => {
    render({ type: 'svg', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<SVG></SVG>')
  })

  it('p w/prop', () => {
    render({ type: 'p', props: { align: 'center' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p align="center"></p>')
  })

  it('p w/child text', () => {
    render({ type: 'p', props: null, children: ['hello'] }, c)
    expect(c.innerHTML).toEqual('<p>hello</p>')
  })

  it('p w/prop arbitrary', () => {
    render({ type: 'p', props: { 'data-whatever': 'foo' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p data-whatever="foo"></p>')
    const p = c.firstChild as any
    expect(p.getAttribute('data-whatever')).toEqual('foo')
  })

  it('input w/prop boolean', () => {
    render({ type: 'input', props: { autoFocus: true }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input autofocus="">')
  })

  it('input w/prop boolean false', () => {
    render({ type: 'input', props: { autoFocus: true }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input autofocus="">')
    render({ type: 'input', props: { autoFocus: false }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
  })

  it('p w/prop update prop', () => {
    render({ type: 'p', props: { align: 'center' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p align="center"></p>')
    const p = c.firstChild!
    expect(p.nodeName).toEqual('P')
    render({ type: 'p', props: { align: 'left' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p align="left"></p>')
    expect(p).toBe(c.firstChild)
  })

  it('img w/prop attribute named', () => {
    render(
      {
        type: 'img',
        props: { crossorigin: 'anonymous' },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop prop named', () => {
    render(
      {
        type: 'img',
        props: { crossOrigin: 'anonymous' },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop then remove', () => {
    render(
      {
        type: 'img',
        props: { crossOrigin: 'anonymous' },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
    render(
      {
        type: 'img',
        props: {},
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<img>')
  })

  it('img w/prop then change case', () => {
    render(
      {
        type: 'img',
        props: { crossOrigin: 'anonymous' },
        children: [],
      },
      c,
    )
    const img = c.firstChild!
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
    render(
      {
        type: 'img',
        props: { crossorigin: '' },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<img crossorigin="">')
    expect(img).toBe(c.firstChild)
  })

  it('p to another', () => {
    render({ type: 'p', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    render({ type: 'input', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
  })

  it('button w/ event listener', () => {
    let clicked = false
    render(
      {
        type: 'button',
        props: { onClick: () => (clicked = true) },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(true)
  })

  it('button w/ event listener & remove', () => {
    let clicked = 0
    render(
      {
        type: 'button',
        props: { onClick: () => clicked++ },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(1)
    render(
      {
        type: 'button',
        props: null,
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<button></button>')
    expect(c.firstChild).toBe(btn)
    btn.click()
    expect(clicked).toEqual(1)
  })

  it('button w/ event listener & change', () => {
    let clicked = 0
    let clickedOther = 0
    render(
      {
        type: 'button',
        props: { onClick: () => clicked++ },
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(1)
    expect(clickedOther).toEqual(0)
    render(
      {
        type: 'button',
        props: { onClick: () => clickedOther++ },
        children: [],
      },
      c,
    )
    expect(c.firstChild).toBe(btn)
    btn.click()
    expect(clicked).toEqual(1)
    expect(clickedOther).toEqual(1)
  })

  it('ul w/children', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
  })

  it('ul w/children & remove child', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
    const ul = c.firstChild as HTMLUListElement
    const lis_3 = Array.from(ul.querySelectorAll('li'))
    expect(lis_3.length).toEqual(3)
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<ul><li></li><li></li></ul>')
    const lis_2 = Array.from(ul.querySelectorAll('li'))
    expect(lis_2.length).toEqual(2)
    expect(lis_3.slice(0, 2)).toEqual(lis_2)
  })

  it('ul w/children & add child', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
    const ul = c.firstChild as HTMLUListElement
    const lis_3 = Array.from(ul.querySelectorAll('li'))
    expect(lis_3.length).toEqual(3)
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
          { type: 'li', props: null, children: [] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li><li></li></ul>')
    const lis_4 = Array.from(ul.querySelectorAll('li'))
    expect(lis_4.length).toEqual(4)
    expect(lis_3).toEqual(lis_4.slice(0, 3))
  })

  it('Fragment w/ texts', () => {
    render(
      {
        type: 'p',
        props: null,
        children: [
          { type: Fragment, props: null, children: ['hello', ' world'] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p>hello world</p>')
  })

  it('Fragment w/ els', () => {
    render(
      {
        type: Fragment,
        props: null,
        children: [
          { type: 'p', props: { align: 'right' }, children: [] },
          { type: 'p', props: { align: 'left' }, children: [] },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p align="right"></p><p align="left"></p>')
  })

  it('Fragment w/ els as single child', () => {
    render(
      {
        type: 'div',
        props: null,
        children: [
          {
            type: Fragment,
            props: null,
            children: [
              { type: 'p', props: null, children: [] },
              { type: 'p', props: null, children: [] },
            ],
          },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<div><p></p><p></p></div>')
    const div = c.firstChild
    const ps = c.querySelectorAll('p')
    expect(ps.length).toEqual(2)
    render(
      {
        type: 'div',
        props: null,
        children: [
          {
            type: Fragment,
            props: null,
            children: [
              { type: 'p', props: { align: 'left' }, children: [] },
              { type: 'p', props: null, children: [] },
            ],
          },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<div><p align="left"></p><p></p></div>')
    const ps_new = c.querySelectorAll('p')
    expect(ps_new).toEqual(ps)
    expect(ps_new[0]).toBe(ps[0])
    expect(ps_new[1]).toBe(ps[1])
    expect(c.firstChild).toBe(div)
  })

  it('function type', () => {
    const Foo = () => ({ type: 'p', props: null, children: [] })
    render(
      {
        type: Foo,
        props: null,
        children: [],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('function type w/ fragment', () => {
    const Foo = () => ({
      type: Fragment,
      props: null,
      children: ['hello', ' world'],
    })
    render(
      {
        type: 'p',
        props: null,
        children: [
          {
            type: Foo,
            props: null,
            children: [],
          },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p>hello world</p>')
  })

  it('function type w/ fragment deep', () => {
    const Bar = () => ({
      type: Fragment,
      props: null,
      children: [' foo', 'bar'],
    })
    const Foo = () => ({
      type: Fragment,
      props: null,
      children: ['hello', ' world', { type: Bar, props: null, children: [] }],
    })
    render(
      {
        type: 'p',
        props: null,
        children: [
          {
            type: Foo,
            props: null,
            children: [],
          },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p>hello world foobar</p>')
  })

  it('function type w/ fragment deep el', () => {
    const Bar = ({ message }: { message: string }) => ({
      type: Fragment,
      props: null,
      children: [' foo', { type: 'span', props: null, children: [message] }],
    })
    const Foo = ({ message }: { message: string }) => ({
      type: Fragment,
      props: null,
      children: [
        'hello',
        ' world',
        { type: Bar, props: { message }, children: [] },
      ],
    })
    render(
      {
        type: 'p',
        props: null,
        children: [
          {
            type: Foo,
            props: { message: 'bar' },
            children: [],
          } as any,
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p>hello world foo<span>bar</span></p>')
    const span = c.querySelector('span') as HTMLSpanElement
    render(
      {
        type: 'p',
        props: null,
        children: [
          {
            type: Foo,
            props: { message: 'zoo' },
            children: [],
          } as any,
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual('<p>hello world foo<span>zoo</span></p>')
    expect(span.textContent).toEqual('zoo')
    expect(c.querySelector('span')).toBe(span)
  })

  it.skip('unknown type throws', () => {
    const Problem = {}
    expect(() => {
      render(
        {
          type: Problem as any,
          props: null,
          children: [],
        },
        c,
      )
    }).toThrow('Unknown VNode type')
  })
})

describe('e2e', () => {
  it('complex 1', () => {
    render(
      {
        type: 'p',
        props: { align: 'center' },
        children: [
          'hello',
          { type: 'br', props: null, children: [] },
          'world',
          { type: 'input', props: { type: 'text' }, children: [] },
          {
            type: 'button',
            props: null,
            children: [
              {
                type: 'span',
                props: null,
                children: ['click me'],
              },
            ],
          },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual(
      '<p align="center">hello<br>world<input type="text">' +
        '<button><span>click me</span></button>' +
        '</p>',
    )
    const input = c.querySelector('input')
    const button = c.querySelector('button')
    render(
      {
        type: 'p',
        props: { align: 'center' },
        children: [
          'hello',
          { type: 'br', props: null, children: [] },
          'there',
          {
            type: 'input',
            props: { type: 'radio', autoFocus: true },
            children: [],
          },
          {
            type: 'button',
            props: null,
            children: [
              {
                type: 'span',
                props: null,
                children: ['click me now'],
              },
            ],
          },
        ],
      },
      c,
    )
    expect(c.innerHTML).toEqual(
      '<p align="center">hello<br>there<input type="radio" autofocus="">' +
        '<button><span>click me now</span></button>' +
        '</p>',
    )
    expect(c.querySelector('input')).toBe(input)
    expect(c.querySelector('button')).toBe(button)
  })
})
