import { h } from './'

class Fragment {}

describe('jsx', () => {
  it('lowercase as string tags', () => {
    const v = <foo />
    expect(v.tag).toEqual('foo')
  })

  it('PascalCase as ctor references', () => {
    class Foo {}
    const v = <Foo />
    expect(v.tag).toEqual(Foo)
  })

  it('fragment', () => {
    const v = <></>
    expect(v.tag).toEqual(Fragment)
  })

  it('with attribute string', () => {
    const v = <foo hello={'world 123'} />
    expect(v.tag).toEqual('foo')
    expect(v.props.hello).toEqual('world 123')
  })

  it('with attribute multiword', () => {
    const v = <foo helloWorld={'hi'} />
    expect(v.tag).toEqual('foo')
    expect(v.props.helloWorld).toEqual('hi')
  })

  it('with attribute number', () => {
    const v = <foo hello={15} />
    expect(v.tag).toEqual('foo')
    expect(v.props.hello).toEqual(15)
  })

  it('with attribute ref', () => {
    const hello = { world: true }
    const v = <foo hello={hello} />
    expect(v.tag).toEqual('foo')
    expect(v.props.hello).toEqual(hello)
  })

  it('with child', () => {
    const v = (
      <foo>
        <bar></bar>
      </foo>
    )
    expect(v.tag).toEqual('foo')
    expect(v.children[0].tag).toEqual('bar')
  })

  it('with child and text', () => {
    const v = (
      <foo>
        <bar></bar>yo
      </foo>
    )
    expect(v.tag).toEqual('foo')
    expect(v.children[0].tag).toEqual('bar')
    expect(v.children[1]).toEqual('yo')
  })

  it('with children mapped', () => {
    const v = (
      <foo>
        {[1, 2, 3].map(x => (
          <bar>{x}</bar>
        ))}
      </foo>
    )
    expect(v.tag).toEqual('foo')
    expect(v.children[0].tag).toEqual('bar')
    expect(v.children[0].children[0]).toEqual(1)
    expect(v.children[1].tag).toEqual('bar')
    expect(v.children[1].children[0]).toEqual(2)
    expect(v.children[2].tag).toEqual('bar')
    expect(v.children[2].children[0]).toEqual(3)
  })

  it('with children empty array', () => {
    const v = <foo>{[]}</foo>
    expect(v.tag).toEqual('foo')
    expect(v.children.length).toEqual(0)
  })
})
