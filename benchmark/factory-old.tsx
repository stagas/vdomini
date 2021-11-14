/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'assert'
import { suite, add, cycle, complete, configure } from 'benny'
import { asciiChartReporter } from 'benny-ascii-chart-reporter'

class Node {
  tag: any
  props: any
  children: any[]
  constructor(tag: any, props: any, children: any[]) {
    this.tag = tag
    this.props = props
    this.children = children
  }
}

// const realClasses = (tag: any, props: any, ...children: any[]) =>
//   new Node(tag, props, children)

const passThrough = (...args: any[]) => args

const hiddenClasses = (tag: any, props: any, ...children: any[]) => ({
  tag,
  props,
  children
})

const hiddenClassesFlat = (tag: any, props: any, ...children: any[]) => ({
  tag,
  props,
  children: children.flat()
})

////////////////

let traverse

const traverseArray = (node: any) => {
  const result: any = []

  if (Array.isArray(node)) {
    for (const child of node) {
      result.push(...traverseArray(child))
    }
  } else {
    result.push(node, ...(node.children ? traverseArray(node.children) : []))
  }

  return result
}

const traverseFlat = (node: any) => {
  const result: any = []

  result.push(node)

  if (node.children)
    for (const child of node.children) {
      result.push(...traverseFlat(child))
    }

  return result
}

let h: any

h = hiddenClasses

class Fragment {}
const factory = ({ prop }: any) => (
  <foo prop={prop} some={'value'}>
    inner <more another={2525}></more>
    <>hello</>
    {[1, 2].map(x => (
      <bar>{x}</bar>
    ))}
  </foo>
)

h = passThrough

// console.log(factory({ prop: 'foo' }))
// process.exit()

{
  h = hiddenClasses
  traverse = traverseArray
  const tree = factory({ prop: 'foo' })
  const result = traverse(tree)
  const expected = [
    tree,
    tree.children[0],
    tree.children[1],
    tree.children[2],
    tree.children[2].children[0],
    tree.children[3][0],
    tree.children[3][0].children[0],
    tree.children[3][1],
    tree.children[3][1].children[0]
  ]
  assert.deepEqual(result, expected)
  assert.equal(expected[4], 'hello')
  assert.equal(expected[8], 2)
}

{
  h = hiddenClassesFlat
  traverse = traverseFlat
  const tree = factory({ prop: 'foo' })
  const result = traverse(tree)
  const expected = [
    tree,
    tree.children[0],
    tree.children[1],
    tree.children[2],
    tree.children[2].children[0],
    tree.children[3],
    tree.children[3].children[0],
    tree.children[4],
    tree.children[4].children[0]
  ]
  assert.deepEqual(result, expected)
  assert.equal(expected[4], 'hello')
  assert.equal(expected[8], 2)
}

// const hiddenClassesDestructure = (...args: any[]) => {
//   const [tag, props, ...children] = args
//   return { tag, props, children }
// }

// const hiddenClassesAssign = (...args: any[]) => ({
//   tag: args[0],
//   props: args[1],
//   children: args
// })

// const array = (...args: any[]) => args

// const arrayFlat = (tag: any, props: any, ...children: any[]) => [
//   tag,
//   props,
//   children.flat()
// ]

suite(
  'jsx factory',

  configure({
    cases: {
      minSamples: 5,
      maxTime: 0.25
    }
  }),

  add('pass through', () => {
    h = passThrough
    return factory({ prop: 'foo' })
  }),

  add('hidden classes', () => {
    h = hiddenClasses
    return factory({ prop: 'foo' })
  }),

  add('hidden classes flat', () => {
    h = hiddenClassesFlat
    return factory({ prop: 'foo' })
  }),

  // add('hidden classes + traverse', () => {
  //   h = hiddenClasses
  //   traverse = traverseArray
  //   return traverse(factory({ prop: 'foo' }))
  // }),

  // add('hidden classes flat + traverse', () => {
  //   h = hiddenClassesFlat
  //   traverse = traverseFlat
  //   return traverse(factory({ prop: 'foo' }))
  // }),

  // add('real classes', () => {
  //   h = realClasses
  //   return factory({ prop: 'foo' })
  // }),

  // add('hidden classes destructure', () => {
  //   h = hiddenClassesDestructure
  //   return factory({ prop: 'foo' })
  // }),

  // add('hidden classes assign', () => {
  //   h = hiddenClassesAssign
  //   return factory({ prop: 'foo' })
  // }),
  // add('array', () => {
  //   h = array
  //   return factory({ prop: 'foo' })
  // }),

  // add('array flat', () => {
  //   h = arrayFlat
  //   return factory({ prop: 'foo' })
  // }),

  cycle(),
  complete(asciiChartReporter()),
  complete()
)
