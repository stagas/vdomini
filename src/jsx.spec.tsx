import { h, Fragment } from './h'

describe('jsx', () => {
  it('lowercase as string tags', () => {
    const v = <foo />
    expect(v.type).toEqual('foo')
  })

  it('PascalCase as ctor references', () => {
    const Foo = () => <></>
    const v = <Foo />
    expect(v.type).toEqual(Foo)
  })

  it('fragment', () => {
    const v = <></>
    expect(v.type).toEqual(Fragment)
  })

  it('with attribute string', () => {
    const v = <foo hello={'world 123'} />
    expect(v.type).toEqual('foo')
    expect(v.props.hello).toEqual('world 123')
  })

  it('with attribute multiword', () => {
    const v = <foo helloWorld={'hi'} />
    expect(v.type).toEqual('foo')
    expect(v.props.helloWorld).toEqual('hi')
  })

  it('with attribute number', () => {
    const v = <foo hello={15} />
    expect(v.type).toEqual('foo')
    expect(v.props.hello).toEqual(15)
  })

  it('with attribute ref', () => {
    const hello = { world: true }
    const v = <foo hello={hello} />
    expect(v.type).toEqual('foo')
    expect(v.props.hello).toEqual(hello)
  })

  it('with child', () => {
    const v = (
      <foo>
        <bar></bar>
      </foo>
    )
    expect(v.type).toEqual('foo')
    expect(v.children[0].type).toEqual('bar')
  })

  it('with child and text', () => {
    const v = (
      <foo>
        <bar></bar>yo
      </foo>
    )
    expect(v.type).toEqual('foo')
    expect(v.children[0].type).toEqual('bar')
    expect(v.children[1]).toEqual('yo')
  })

  it('with children mapped', () => {
    const v = (
      <foo>
        {[1, 2, 3].map(x => (
          <bar key={x}>{x}</bar>
        ))}
      </foo>
    )
    expect(v.type).toEqual('foo')
    expect(v.children[0][0].type).toEqual('bar')
    expect(v.children[0][0].children[0]).toEqual(1)
    expect(v.children[0][1].type).toEqual('bar')
    expect(v.children[0][1].children[0]).toEqual(2)
    expect(v.children[0][2].type).toEqual('bar')
    expect(v.children[0][2].children[0]).toEqual(3)
  })

  it('with children empty array', () => {
    const v = <foo>{[]}</foo>
    expect(v.type).toEqual('foo')
    expect(v.children.length).toEqual(1)
    expect(v.children[0].length).toEqual(0)
  })

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
          {Array(100).map((_, i: number) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    )
    expect(v.type).toEqual('div')
  })
})
