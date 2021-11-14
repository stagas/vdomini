import { render } from './render'

let c: HTMLDivElement

describe('render(el, v)', () => {
  beforeEach(() => (c = document.createElement('div')))

  it('p', () => {
    render(c, { tag: 'p', props: null, children: [] })
    expect(c.outerHTML).toEqual('<div><p></p></div>')
    expect(c.innerHTML).toEqual('<p></p>')
  })

  it('p w/prop', () => {
    render(c, { tag: 'p', props: { align: 'center' }, children: [] })
    expect(c.innerHTML).toEqual('<p align="center"></p>')
  })

  it('img w/prop qualified', () => {
    render(c, { tag: 'img', props: { crossorigin: 'anonymous' }, children: [] })
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })

  it('img w/prop camelCase', () => {
    render(c, { tag: 'img', props: { crossOrigin: 'anonymous' }, children: [] })
    expect(c.innerHTML).toEqual('<img crossorigin="anonymous">')
  })
})
