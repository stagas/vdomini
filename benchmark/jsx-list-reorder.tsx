/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { suite, add, finish } from 'benny-vipu'

import { h as vdomini_h, Fragment as vdomini_f } from '../src/h'
import { render as vdomini_r } from '../src/render'

import { h as preact_h, render as preact_r, Fragment as preact_f } from 'preact'

import { render as inferno_r, Fragment as inferno_f } from 'inferno'
import { createElement as inferno_h } from 'inferno-create-element'

// @ts-ignore
import { render as react_r } from 'react-dom'
// @ts-ignore
import { createElement as react_h, Fragment as react_f } from 'react'

let container: any

let Fragment: any
let h: any
let r: any
let count = 0

const onClick = () => {
  /* void */
}

const randomly = () => Math.random() - 0.5

const factory = ({ list }: any) => (
  <ul>
    {list.map((item: any) => (
      <li key={item.key}>{item.value}</li>
    ))}
  </ul>
)

const render = (tree: any) => {
  r(tree, container)
}

// frameworks use microtasks that beat benchmarks
const nextTick = (fn: any) =>
  new Promise<void>(resolve =>
    setTimeout(() => {
      fn()
      resolve()
    }, 1),
  )

const create = (count: number, name: string) => {
  let c: any

  document.body.innerHTML =
    '<style>li { display: block; width: 200px; height: 50px; font-size: 16px; }</style>'
  container = document.createElement('div')
  document.body.appendChild(container)

  const list = Array(count)
    .fill(0)
    .map((_, i) => ({ key: i, value: i }))

  console.time('render ' + name)

  // for (let i = 0; i < count; i++) {
  //   const a = (Math.random() * count) | 0
  //   const b = (Math.random() * count) | 0
  //   list.splice(b, 0, list.splice(a, 1, list[b])[0])
  //   c = factory({ list })
  //   render(c)
  // }

  for (let i = 0; i < count; i++) {
    c = factory({ list: list.sort(randomly) })
    render(c)
  }

  return nextTick(() => {
    console.timeEnd('render ' + name)
    return c
  })

  // console.time('render ' + name)
  // for (let i = 0; i < count; i++) {
  //   c = factory({ list: list.sort(randomly) })
  //   render(c)
  // }
  // console.timeEnd('render ' + name)

  // return c
}

const cases: any = {
  vdomini: [vdomini_h, vdomini_r, vdomini_f],
  react: [react_h, react_r, react_f],
  preact: [preact_h, preact_r, preact_f],
  inferno: [inferno_h, inferno_r, inferno_f],
}

// const testAllEqual = () => {
//   let prev
//   for (const c in cases) {
//     ;[h, r, Fragment] = cases[c]
//     count = 10
//     create(1, c)
//     const html = document.body.innerHTML
//     if (prev && prev !== html) {
//       console.error(prev)
//       console.error(html)
//       throw new Error('Not equal: ' + c)
//     }
//     prev = html
//   }
// }

// testAllEqual()

// bench

const bench = async () => {
  for (count of [500]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, async () => {
            ;[h, r, Fragment] = cases[c]
            return create(count, c)
          }),
        ),
    )
  }
}

;(function run() {
  bench().then(run)
})()
