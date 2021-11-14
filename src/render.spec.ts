/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, Fragment } from './render'

let c: HTMLDivElement
beforeEach(() => (c = document.createElement('div')))

describe('render(el, v)', () => {
  it('p', () => {
    render(c, { type: 'p', props: null, children: [] })
    expect(c.outerHTML).toEqual('<div><p></p></div>')
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('svg', () => {
    render(c, { type: 'svg', props: null, children: [] })
    expect(c.innerHTML).toEqual('<svg></svg>')
  })

  it('p w/prop', () => {
    render(c, { type: 'p', props: { align: 'center' }, children: [] })
    expect(c.innerHTML).toEqual('<p align="center"></p>')
  })

  it('p w/child text', () => {
    render(c, { type: 'p', props: null, children: ['hello'] })
    expect(c.innerHTML).toEqual('<p>hello</p>')
  })

  it('p w/prop arbitrary', () => {
    render(c, { type: 'p', props: { 'data-whatever': 'foo' }, children: [] })
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p['data-whatever']).toEqual('foo')
  })

  it('input w/prop boolean', () => {
    render(c, { type: 'input', props: { autoFocus: true }, children: [] })
    expect(c.innerHTML).toEqual('<input autofocus="">')
  })

  it('input w/prop boolean false', () => {
    render(c, { type: 'input', props: { autoFocus: true }, children: [] })
    expect(c.innerHTML).toEqual('<input autofocus="">')
    render(c, { type: 'input', props: { autoFocus: false }, children: [] })
    expect(c.innerHTML).toEqual('<input>')
  })

  it('p w/prop update prop', () => {
    render(c, { type: 'p', props: { align: 'center' }, children: [] })
    expect(c.innerHTML).toEqual('<p align="center"></p>')
    const p = c.firstChild!
    expect(p.nodeName).toEqual('P')
    render(c, { type: 'p', props: { align: 'left' }, children: [] })
    expect(c.innerHTML).toEqual('<p align="left"></p>')
    expect(p).toBe(c.firstChild)
  })

  it('img w/prop attribute named', () => {
    render(c, {
      type: 'img',
      props: { crossorigin: 'anonymous' },
      children: [],
    })
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop prop named', () => {
    render(c, {
      type: 'img',
      props: { crossOrigin: 'anonymous' },
      children: [],
    })
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop then remove', () => {
    render(c, {
      type: 'img',
      props: { crossOrigin: 'anonymous' },
      children: [],
    })
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
    render(c, {
      type: 'img',
      props: {},
      children: [],
    })
    expect(c.innerHTML).toEqual('<img>')
  })

  it('img w/prop then change case', () => {
    render(c, {
      type: 'img',
      props: { crossOrigin: 'anonymous' },
      children: [],
    })
    const img = c.firstChild!
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
    render(c, {
      type: 'img',
      props: { crossorigin: '' },
      children: [],
    })
    expect(c.innerHTML).toEqual('<img crossorigin="">')
    expect(img).toBe(c.firstChild)
  })

  it('p to another', () => {
    render(c, { type: 'p', props: null, children: [] })
    expect(c.innerHTML).toEqual('<p></p>')
    render(c, { type: 'input', props: null, children: [] })
    expect(c.innerHTML).toEqual('<input>')
  })

  it('button w/ event listener', () => {
    let clicked = false
    render(c, {
      type: 'button',
      props: { onClick: () => (clicked = true) },
      children: [],
    })
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(true)
  })

  it('button w/ event listener & remove', () => {
    let clicked = 0
    render(c, {
      type: 'button',
      props: { onClick: () => clicked++ },
      children: [],
    })
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(1)
    render(c, {
      type: 'button',
      props: null,
      children: [],
    })
    expect(c.firstChild).toBe(btn)
    btn.click()
    expect(clicked).toEqual(1)
  })

  it('button w/ event listener & change', () => {
    let clicked = 0
    let clickedOther = 0
    render(c, {
      type: 'button',
      props: { onClick: () => clicked++ },
      children: [],
    })
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(1)
    expect(clickedOther).toEqual(0)
    render(c, {
      type: 'button',
      props: { onClick: () => clickedOther++ },
      children: [],
    })
    expect(c.firstChild).toBe(btn)
    btn.click()
    expect(clicked).toEqual(1)
    expect(clickedOther).toEqual(1)
  })

  it('ul w/children', () => {
    render(c, {
      type: 'ul',
      props: null,
      children: [
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
      ],
    })
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
  })

  it('ul w/children & remove child', () => {
    render(c, {
      type: 'ul',
      props: null,
      children: [
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
      ],
    })
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
    const ul = c.firstChild as HTMLUListElement
    const lis_3 = Array.from(ul.querySelectorAll('li'))
    expect(lis_3.length).toEqual(3)
    render(c, {
      type: 'ul',
      props: null,
      children: [
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
      ],
    })
    expect(c.innerHTML).toEqual('<ul><li></li><li></li></ul>')
    const lis_2 = Array.from(ul.querySelectorAll('li'))
    expect(lis_2.length).toEqual(2)
    expect(lis_3.slice(0, 2)).toEqual(lis_2)
  })

  it('ul w/children & add child', () => {
    render(c, {
      type: 'ul',
      props: null,
      children: [
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
      ],
    })
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
    const ul = c.firstChild as HTMLUListElement
    const lis_3 = Array.from(ul.querySelectorAll('li'))
    expect(lis_3.length).toEqual(3)
    render(c, {
      type: 'ul',
      props: null,
      children: [
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
        { type: 'li', props: null, children: [] },
      ],
    })
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li><li></li></ul>')
    const lis_4 = Array.from(ul.querySelectorAll('li'))
    expect(lis_4.length).toEqual(4)
    expect(lis_3).toEqual(lis_4.slice(0, 3))
  })

  it('Fragment w/ texts', () => {
    render(c, {
      type: 'p',
      props: null,
      children: [
        { type: Fragment, props: null, children: ['hello', ' world'] },
      ],
    })
    expect(c.innerHTML).toEqual('<p>hello world</p>')
  })

  it('Fragment w/ els', () => {
    render(c, {
      type: Fragment,
      props: null,
      children: [
        { type: 'p', props: { align: 'right' }, children: [] },
        { type: 'p', props: { align: 'left' }, children: [] },
      ],
    })
    expect(c.innerHTML).toEqual('<p align="right"></p><p align="left"></p>')
  })

  it('function type', () => {
    const Foo = () => ({ type: 'p', props: null, children: [] })
    render(c, {
      type: Foo,
      props: null,
      children: [],
    })
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('unknown type throws', () => {
    const Problem = {}
    expect(() => {
      render(c, {
        type: Problem as any,
        props: null,
        children: [],
      })
    }).toThrow('Unknown VNode type')
  })
})

describe('e2e', () => {
  it('complex 1', () => {
    render(c, {
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
    })
    expect(c.innerHTML).toEqual(
      '<p align="center">hello<br>world<input type="text">' +
        '<button><span>click me</span></button>' +
        '</p>',
    )
    const input = c.querySelector('input')
    const button = c.querySelector('button')
    render(c, {
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
    })
    expect(c.innerHTML).toEqual(
      '<p align="center">hello<br>there<input type="radio" autofocus="">' +
        '<button><span>click me now</span></button>' +
        '</p>',
    )
    expect(c.querySelector('input')).toBe(input)
    expect(c.querySelector('button')).toBe(button)
  })
})
