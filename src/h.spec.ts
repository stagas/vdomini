import { h, Fragment } from './h'

describe('h(type, props, children)', () => {
  it('type=string', () => {
    const v = h('foo')
    expect(v.type).toEqual('foo')
  })

  it('type=undefined', () => {
    const v = h(undefined)
    expect(v.type).toEqual(undefined)
  })

  it('type=null', () => {
    const v = h(null)
    expect(v.type).toEqual(null)
  })

  it('type=function', () => {
    const Foo = () => h('foo')
    const v = h(Foo)
    expect(v.type).toEqual(Foo)
  })

  it('type=custom element constructor', () => {
    class Foo extends HTMLElement {}
    const v = h(Foo)
    expect(v.type).toEqual(Foo)
  })

  it('type=fragment', () => {
    const v = h(Fragment)
    expect(v.type).toEqual(Fragment)
  })

  it('with props', () => {
    const v = h('foo', { hello: 'world' })
    expect(v.type).toEqual('foo')
    expect(v.props!.hello).toEqual('world')
  })

  it('with children', () => {
    const v = h('foo', null, 'hello', 'world')
    expect(v.type).toEqual('foo')
    expect(v.children[0]).toEqual('hello')
    expect(v.children[1]).toEqual('world')
  })
})
