/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, render } from '../'

let c: HTMLDivElement
beforeEach(() => (c = document.createElement('div')))

describe('render(v, el)', () => {
  it('p', () => {
    render({ type: 'p', props: null, children: [] }, c)
    expect(c.outerHTML).toEqual('<div><p></p></div>')
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('p with id', () => {
    render({ type: 'p', props: { id: 'foo' }, children: [] }, c)
    expect(c.outerHTML).toEqual('<div><p id="foo"></p></div>')
    expect(c.innerHTML).toEqual('<p id="foo"></p>')
    const p = c.firstChild as HTMLElement
    expect(p.id).toEqual('foo')
  })

  it('p w/class', () => {
    render({ type: 'p', props: { class: 'foo' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p class="foo"></p>')
  })

  it('p w/class change', () => {
    render({ type: 'p', props: { class: 'foo' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p class="foo"></p>')
    render({ type: 'p', props: { class: 'bar' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p class="bar"></p>')
  })

  it('p w/class change empty', () => {
    render({ type: 'p', props: { class: '' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p class=""></p>')
    render({ type: 'p', props: { class: 'bar' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p class="bar"></p>')
  })

  it('p no class then w/class', () => {
    render({ type: 'p', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    render({ type: 'p', props: { class: 'bar' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p class="bar"></p>')
  })

  it('is=custom-element', () => {
    const Custom = class extends HTMLTextAreaElement {}
    const id = 'custom-' + ((Math.random() * 10e6) | 0).toString(36)
    customElements.define(id, Custom, { extends: 'textarea' })
    render({ type: 'textarea', props: { is: id }, children: [] }, c)
    expect(c.innerHTML).toEqual(`<textarea is="${id}"></textarea>`)
    expect(c.firstChild).toBeInstanceOf(Custom)
  })

  it('custom elements not implemented', () => {
    expect(() => {
      render({ type: class extends HTMLElement {}, props: null, children: [] }, c)
    }).toThrow('not implemented')
  })

  it('svg', () => {
    render({ type: 'svg', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<svg></svg>')
  })

  it('svg prop', () => {
    render({ type: 'svg', props: { id: 'foo', viewBox: '0 0 10 10' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<svg id="foo" viewBox="0 0 10 10"></svg>')
    const svg = c.firstChild as SVGElement
    expect(svg.id).toEqual('foo')
  })

  it('svg child prop', () => {
    render(
      {
        type: 'svg',
        props: null,
        children: [{ type: 'path', props: { pathLength: 90 }, children: [] }],
      },
      c
    )
    expect(c.innerHTML).toEqual('<svg><path pathLength="90"></path></svg>')
  })

  it('svg then foreignObject exodus', () => {
    render(
      {
        type: 'svg',
        props: null,
        children: [
          { type: 'path', props: { pathLength: 90 }, children: [] },
          {
            type: 'foreignObject',
            props: null,
            children: [{ type: 'input', props: { autoFocus: true }, children: [] }],
          },
        ],
      },
      c
    )
    expect(c.innerHTML).toEqual(
      '<svg><path pathLength="90"></path><foreignObject><input autofocus=""></foreignObject></svg>'
    )
  })

  it('p w/ref', () => {
    const ref: any = {}
    render({ type: 'p', props: { ref }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p.ref).toEqual(undefined)
    expect(ref.current).toBe(p)
  })

  it('p w/ref = null', () => {
    const ref: any = null
    render({ type: 'p', props: { ref }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p.ref).toEqual(undefined)
  })

  it('p w/ref update', () => {
    const ref: any = {}
    render({ type: 'p', props: { ref }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p.ref).toEqual(undefined)
    expect(ref.current).toBe(p)

    render({ type: 'p', props: { ref, align: 'center' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p align="center"></p>')
    const p2 = c.firstChild as any
    expect(p2.ref).toEqual(undefined)
    expect(ref.current).toBe(p2)
    expect(ref.current).toBe(p)

    render({ type: 'div', props: { ref }, children: [] }, c)
    expect(c.innerHTML).toEqual('<div></div>')
    const div = c.firstChild as any
    expect(div.ref).toEqual(undefined)
    expect(ref.current).toBe(div)
  })

  it('p w/ref different ref', () => {
    const ref: any = {}
    render({ type: 'p', props: { ref }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p.ref).toEqual(undefined)
    expect(ref.current).toBe(p)

    const ref2: any = {}
    render({ type: 'p', props: { ref: ref2 }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p2 = c.firstChild as any
    expect(p2.ref).toEqual(undefined)
    expect(ref.current).toBe(p)
    expect(ref2.current).toBe(p2)
  })

  it('p w/prop', () => {
    render({ type: 'p', props: { align: 'center' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p align="center"></p>')
  })

  it('p w/child text', () => {
    render({ type: 'p', props: null, children: ['hello'] }, c)
    expect(c.innerHTML).toEqual('<p>hello</p>')
  })

  it('p w/child undefined', () => {
    render({ type: 'p', props: null, children: ['hello', undefined] }, c)
    expect(c.innerHTML).toEqual('<p>hello</p>')
  })

  it('p w/child false', () => {
    render({ type: 'p', props: null, children: ['hello', false] }, c)
    expect(c.innerHTML).toEqual('<p>hello</p>')
  })

  it('p w/prop arbitrary', () => {
    render({ type: 'p', props: { 'data-whatever': 'foo' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p data-whatever="foo"></p>')
    const p = c.firstChild as any
    expect(p.getAttribute('data-whatever')).toEqual('foo')
  })

  it('p w/prop object', () => {
    render({ type: 'p', props: { whatever: { foo: 'bar' } }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p.whatever).toEqual({ foo: 'bar' })
  })

  it('p w/prop object then update', () => {
    render({ type: 'p', props: { whatever: { foo: 'bar' } }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
    const p = c.firstChild as any
    expect(p.whatever).toEqual({ foo: 'bar' })
    render({ type: 'p', props: { whatever: { foo: 'zoo' } }, children: [] }, c)
    expect(p.whatever).toEqual({ foo: 'zoo' })
  })

  it('input w/prop boolean', () => {
    render({ type: 'input', props: { autofocus: true }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input autofocus="">')
  })

  it('input w/prop checked boolean', () => {
    render({ type: 'input', props: { checked: true }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
    const input = c.firstChild as any
    expect(input.checked).toEqual(true)
  })

  it('input w/prop boolean false', () => {
    render({ type: 'input', props: { autofocus: true }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input autofocus="">')
    render({ type: 'input', props: { autoFocus: false }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
  })

  it('input w/prop boolean added', () => {
    render({ type: 'input', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
    render({ type: 'input', props: { autofocus: true }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input autofocus="">')
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

  it('input w/prop value', () => {
    render({ type: 'input', props: { value: '' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
    const input = c.firstChild as HTMLInputElement
    expect(input.value).toEqual('')
    input.value = 'hello'
    expect(input.value).toEqual('hello')
    render({ type: 'input', props: { value: '' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<input>')
    expect(input.value).toEqual('')
  })

  it('img w/prop attribute named', () => {
    render(
      {
        type: 'img',
        props: { crossorigin: 'anonymous' },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop prop named', () => {
    render(
      {
        type: 'img',
        props: { crossorigin: 'anonymous' },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop then remove', () => {
    render(
      {
        type: 'img',
        props: { crossorigin: 'anonymous' },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
    render(
      {
        type: 'img',
        props: {},
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img>')
  })

  it('img w/prop object then remove', () => {
    render(
      {
        type: 'img',
        props: { obj: { foo: 'bar' } },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img>')
    const img = c.firstChild as any
    expect(img.obj).toEqual({ foo: 'bar' })
    render(
      {
        type: 'img',
        props: {},
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img>')
    expect(img.obj).toEqual(undefined)
  })

  it('img w/prop object then null props remove', () => {
    render(
      {
        type: 'img',
        props: { obj: { foo: 'bar' } },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img>')
    const img = c.firstChild as any
    expect(img.obj).toEqual({ foo: 'bar' })
    render(
      {
        type: 'img',
        props: null,
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<img>')
    expect(img.obj).toEqual(undefined)
  })

  it('img w/prop then change case', () => {
    render(
      {
        type: 'img',
        props: { crossorigin: 'anonymous' },
        children: [],
      },
      c
    )
    const img = c.firstChild!
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
    render(
      {
        type: 'img',
        props: { crossorigin: '' },
        children: [],
      },
      c
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
        props: { onclick: () => (clicked = true) },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(true)
  })

  it('button w/ event listener rerender', () => {
    let clicked1 = 0
    let clicked2 = 0
    render(
      {
        type: 'button',
        props: { onclick: () => clicked1++ },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    {
      const btn = c.firstChild as HTMLButtonElement
      btn.click()
    }
    expect(clicked1).toEqual(1)
    render(
      {
        type: 'button',
        props: { onclick: () => clicked2++ },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    {
      const btn = c.firstChild as HTMLButtonElement
      btn.click()
    }
    expect(clicked1).toEqual(1)
    expect(clicked2).toEqual(1)
  })

  it('button w/ event listener & remove', () => {
    let clicked = 0
    render(
      {
        type: 'button',
        props: { onclick: () => clicked++ },
        children: [],
      },
      c
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
      c
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
        props: { onclick: () => clicked++ },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<button onclick=""></button>')
    const btn = c.firstChild as HTMLButtonElement
    btn.click()
    expect(clicked).toEqual(1)
    expect(clickedOther).toEqual(0)
    render(
      {
        type: 'button',
        props: { onclick: () => clickedOther++ },
        children: [],
      },
      c
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
      c
    )
    expect(c.innerHTML).toEqual('<ul><li></li><li></li><li></li></ul>')
  })

  it('ul w/children keyed empty then add', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<ul></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li><li id="third"></li></ul>')
    expect(prev[0].id).toEqual('first')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(prev[1].id).toEqual('second')
    expect(prev[2].id).toEqual('third')

    expect(next[0].id).toEqual('second')
    expect(next[1].id).toEqual('third')
    expect(next[2].id).toEqual('first')

    expect(prev[0] === next[2]).toBe(true)
    expect(prev[1]).toBe(next[0])
    expect(prev[2]).toBe(next[1])
    expect(c.innerHTML).toEqual('<ul><li id="second"></li><li id="third"></li><li id="first"></li></ul>')
  })

  it('ul w/children w/ siblings then remove', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<ul></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          'hello',
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(c.innerHTML).toEqual('<ul>hello<li id="first"></li><li id="second"></li><li id="third"></li></ul>')
    expect(prev[0].id).toEqual('first')
    render(
      {
        type: 'ul',
        props: null,
        children: ['hello'],
      },
      c
    )
    expect(c.innerHTML).toEqual('<ul>hello</ul>')
  })

  it('ul w/children keyed reorder', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li><li id="third"></li></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(prev[1].id).toEqual('second')
    expect(prev[2].id).toEqual('third')

    expect(next[0].id).toEqual('second')
    expect(next[1].id).toEqual('third')
    expect(next[2].id).toEqual('first')

    expect(prev[0] === next[2]).toBe(true)
    expect(prev[1]).toBe(next[0])
    expect(prev[2]).toBe(next[1])
    expect(c.innerHTML).toEqual('<ul><li id="second"></li><li id="third"></li><li id="first"></li></ul>')
  })

  it('fragment w/children keyed reorder', () => {
    render(
      {
        type: Fragment,
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(c.innerHTML).toEqual('<li id="first"></li><li id="second"></li><li id="third"></li>')
    render(
      {
        type: Fragment,
        props: null,
        children: [
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(prev[1].id).toEqual('second')
    expect(prev[2].id).toEqual('third')

    expect(next[0].id).toEqual('second')
    expect(next[1].id).toEqual('third')
    expect(next[2].id).toEqual('first')

    expect(prev[0] === next[2]).toBe(true)
    expect(prev[1]).toBe(next[0])
    expect(prev[2]).toBe(next[1])
    expect(c.innerHTML).toEqual('<li id="second"></li><li id="third"></li><li id="first"></li>')
  })

  it('ul w/children keyed swap', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 2 }, children: [] },
          { type: 'li', props: { id: 'third', key: 3 }, children: [] },
          { type: 'li', props: { id: 'four', key: 4 }, children: [] },
          { type: 'li', props: { id: 'five', key: 5 }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(c.innerHTML).toEqual(
      '<ul><li id="first"></li><li id="second"></li><li id="third"></li><li id="four"></li><li id="five"></li></ul>'
    )
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'four', key: 4 }, children: [] },
          { type: 'li', props: { id: 'third', key: 3 }, children: [] },
          { type: 'li', props: { id: 'second', key: 2 }, children: [] },
          { type: 'li', props: { id: 'five', key: 5 }, children: [] },
        ],
      },
      c
    )
    {
      const next = Array.from(c.querySelectorAll('li'))
      expect(prev[0].id).toEqual('first')
      expect(prev[1].id).toEqual('second')
      expect(prev[2].id).toEqual('third')
      expect(prev[3].id).toEqual('four')
      expect(prev[4].id).toEqual('five')

      expect(next[0].id).toEqual('first')
      expect(next[1].id).toEqual('four')
      expect(next[2].id).toEqual('third')
      expect(next[3].id).toEqual('second')
      expect(next[4].id).toEqual('five')
    }

    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 2 }, children: [] },
          { type: 'li', props: { id: 'third', key: 3 }, children: [] },
          { type: 'li', props: { id: 'four', key: 4 }, children: [] },
          { type: 'li', props: { id: 'five', key: 5 }, children: [] },
        ],
      },
      c
    )
    {
      const next = Array.from(c.querySelectorAll('li'))
      expect(prev[0].id).toEqual('first')
      expect(prev[1].id).toEqual('second')
      expect(prev[2].id).toEqual('third')
      expect(prev[3].id).toEqual('four')
      expect(prev[4].id).toEqual('five')

      expect(next[0].id).toEqual('first')
      expect(next[1].id).toEqual('second')
      expect(next[2].id).toEqual('third')
      expect(next[3].id).toEqual('four')
      expect(next[4].id).toEqual('five')
    }

    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'four', key: 4 }, children: [] },
          { type: 'li', props: { id: 'third', key: 3 }, children: [] },
          { type: 'li', props: { id: 'second', key: 2 }, children: [] },
          { type: 'li', props: { id: 'five', key: 5 }, children: [] },
        ],
      },
      c
    )
    {
      const next = Array.from(c.querySelectorAll('li'))
      expect(prev[0].id).toEqual('first')
      expect(prev[1].id).toEqual('second')
      expect(prev[2].id).toEqual('third')
      expect(prev[3].id).toEqual('four')
      expect(prev[4].id).toEqual('five')

      expect(next[0].id).toEqual('first')
      expect(next[1].id).toEqual('four')
      expect(next[2].id).toEqual('third')
      expect(next[3].id).toEqual('second')
      expect(next[4].id).toEqual('five')
    }
  })

  it('ul w/children keyed insert', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(prev[1].id).toEqual('third')
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="third"></li></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(prev[1].id).toEqual('third')

    expect(next[0].id).toEqual('first')
    expect(next[1].id).toEqual('second')
    expect(next[2].id).toEqual('third')

    expect(prev[0] === next[0]).toBe(true)
    expect(prev[1] === next[2]).toBe(true)

    expect(prev[0]).toBe(next[0])
    expect(prev[1]).toBe(next[2])

    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li><li id="third"></li></ul>')
  })

  it('ul w/children keyed append', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(prev[0] === next[0]).toBe(true)
    expect(prev[1] === next[1]).toBe(true)

    expect(next[0].id).toEqual('first')
    expect(next[1].id).toEqual('second')
    expect(next[2].id).toEqual('third')
  })

  it('ul w/children keyed prepend', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('second')
    expect(c.innerHTML).toEqual('<ul><li id="second"></li><li id="third"></li></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li><li id="third"></li></ul>')
    expect(prev[0] === next[1]).toBe(true)
    expect(prev[1] === next[2]).toBe(true)

    expect(next[0].id).toEqual('first')
    expect(next[1].id).toEqual('second')
    expect(next[2].id).toEqual('third')
  })

  it('ul w/children keyed remove', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )

    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li><li id="third"></li></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(prev[0] === next[0]).toBe(true)
    expect(prev[2] === next[1]).toBe(true)

    expect(next[0].id).toEqual('first')
    expect(next[1].id).toEqual('third')
  })

  it('ul w/children keyed clear', () => {
    render(
      {
        type: 'ul',
        props: null,
        children: [
          { type: 'li', props: { id: 'first', key: 1 }, children: [] },
          { type: 'li', props: { id: 'second', key: 'foo' }, children: [] },
          { type: 'li', props: { id: 'third', key: true }, children: [] },
        ],
      },
      c
    )

    const prev = Array.from(c.querySelectorAll('li'))
    expect(prev[0].id).toEqual('first')
    expect(c.innerHTML).toEqual('<ul><li id="first"></li><li id="second"></li><li id="third"></li></ul>')
    render(
      {
        type: 'ul',
        props: null,
        children: [],
      },
      c
    )
    const next = Array.from(c.querySelectorAll('li'))
    expect(c.innerHTML).toEqual('<ul></ul>')
    expect(next.length).toEqual(0)
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
      c
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
      c
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
      c
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
      c
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
        children: [{ type: Fragment, props: null, children: ['hello', ' world'] }],
      },
      c
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
      c
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
      c
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
      c
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
      c
    )
    expect(c.innerHTML).toEqual('<p></p>')
  })

  // it.skip('function w/ hook', () => {
  //   let hook: any
  //   let i = 0
  //   const Foo = () => {
  //     hook = current.hook
  //     return { type: 'p', props: null, children: [i++] }
  //   }
  //   render(
  //     {
  //       type: Foo,
  //       props: null,
  //       children: [],
  //     },
  //     c,
  //   )
  //   expect(c.innerHTML).toEqual('<p>0</p>')
  //   expect(hook.parent).toBe(c)
  //   trigger(hook)
  //   expect(hook.parent).toBe(c)
  //   expect(c.innerHTML).toEqual('<p>1</p>')
  //   trigger(hook)
  //   expect(c.innerHTML).toEqual('<p>2</p>')
  // })

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
      c
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
      c
    )
    expect(c.innerHTML).toEqual('<p>hello world foobar</p>')
  })

  it('function type w/ fragment deep el', () => {
    const Bar = ({ message }: { message: string }) => ({
      type: Fragment,
      props: null,
      children: [' foo', { type: 'span', props: null, children: [message] }],
    })
    const Foo: any = ({ message }: { message: string }) => ({
      type: Fragment,
      props: null,
      children: ['hello', ' world', { type: Bar, props: { message }, children: [] }],
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
          },
        ],
      },
      c
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
      c
    )
    expect(c.innerHTML).toEqual('<p>hello world foo<span>zoo</span></p>')
    expect(span.textContent).toEqual('zoo')
    expect(c.querySelector('span')).toBe(span)
  })

  it('p style string (cssText)', () => {
    render({ type: 'p', props: { style: 'overflow-wrap:normal' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal"></p>')
  })

  it('p style string (cssText) update', () => {
    render({ type: 'p', props: { style: 'overflow-wrap:normal' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal"></p>')
    render({ type: 'p', props: { style: 'overflow-wrap:break-word' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:break-word"></p>')
  })

  it('p style string (cssText) remove empty', () => {
    render({ type: 'p', props: { style: 'overflow-wrap:normal' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal"></p>')
    render({ type: 'p', props: { style: '' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style=""></p>')
  })

  it('p style string (cssText) remove missing from props', () => {
    render({ type: 'p', props: { style: 'overflow-wrap:normal' }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal"></p>')
    render({ type: 'p', props: null, children: [] }, c)
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('p style object', () => {
    render({ type: 'p', props: { style: { overflowWrap: 'normal' } }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal;"></p>')
  })

  it('p style object unknown property', () => {
    render(
      {
        type: 'p',
        props: { style: { unknownProperty: 'normal' } },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<p style="unknown-property:normal;"></p>')
  })

  it('p style object add', () => {
    render({ type: 'p', props: { style: { overflowWrap: 'normal' } }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal;"></p>')
    render(
      {
        type: 'p',
        props: { style: { overflowWrap: 'normal', color: 'blue' } },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal;color:blue;"></p>')
  })

  it('p style object remove', () => {
    render(
      {
        type: 'p',
        props: { style: { overflowWrap: 'normal', color: 'blue' } },
        children: [],
      },
      c
    )
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal;color:blue;"></p>')
    render({ type: 'p', props: { style: { overflowWrap: 'normal' } }, children: [] }, c)
    expect(c.innerHTML).toEqual('<p style="overflow-wrap:normal;"></p>')
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
        c
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
      c
    )
    expect(c.innerHTML).toEqual(
      '<p align="center">hello<br>world<input type="text">' + '<button><span>click me</span></button>' + '</p>'
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
      c
    )
    expect(c.innerHTML).toEqual(
      '<p align="center">hello<br>there<input type="radio" autofocus="">' +
        '<button><span>click me now</span></button>' +
        '</p>'
    )
    expect(c.querySelector('input')).toBe(input)
    expect(c.querySelector('button')).toBe(button)
  })
})
