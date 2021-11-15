import { h } from './'

describe('h(tag, props, children)', () => {
  it('from string tag', () => {
    const v = h('foo', null)
    expect(v.type).toEqual('foo')
  })

  it('from ctor', () => {
    class Foo {}
    const v = h(Foo, null)
    expect(v.type).toEqual(Foo)
  })

  it('with props', () => {
    const v = h('foo', { hello: 'world' })
    expect(v.type).toEqual('foo')
    expect(v.props?.hello).toEqual('world')
  })

  // it('transform kebab-case to camelCase props', () => {
  //   const v = h('foo', { 'hello-there': 'world' })
  //   expect(v.type).toEqual('foo')
  //   expect(v.props?.helloThere).toEqual('world')
  // })

  it('with children', () => {
    const v = h('foo', null, 'hello', 'world')
    expect(v.type).toEqual('foo')
    expect(v.children[0]).toEqual('hello')
    expect(v.children[1]).toEqual('world')
  })
})
