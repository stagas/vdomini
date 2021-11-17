/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { suite, add, finish } from 'benny-vipu'

import { h as vdomini_h, Fragment as vdomini_f } from '../src/h'
import { render as vdomini_r } from '../src/render'

// import { h as preact_h, render as preact_r, Fragment as preact_f } from 'preact'

import { render as inferno_r, Fragment as inferno_f } from 'inferno'
import { createElement as inferno_h } from 'inferno-create-element'

// import { render as react_r } from 'react-dom'
// import { createElement as react_h, Fragment as react_f } from 'react'

let container: any

let Fragment: any
let h: any
let r: any
let count = 0

const factory = ({ prop, i }: any) => (
  <div
    style={
      i % 5 === 0
        ? { width: '10px' }
        : {
            width: Math.random() * 200 + 'px',
            height: Math.random() * 50 + 'px',
            color: ['blue', 'red', 'yellow'][(Math.random() * 3) | 0],
            background: ['blue', 'red', 'yellow'][(Math.random() * 3) | 0],
            overflow: i % 2 === 0 ? 'hidden' : 'visible',
          }
    }
  ></div>
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
    }, 0),
  )

const create = (count: number, name: string) => {
  let c

  document.body.innerHTML = ''
  container = document.createElement('div')
  document.body.appendChild(container)

  console.time('render ' + name)
  for (let i = 0; i < count; i++) {
    c = factory({ prop: 'foo', i })
    render(c)
  }
  nextTick(() => {
    console.timeEnd('render ' + name)
  })

  return c
}

const cases: any = {
  vdomini: [vdomini_h, vdomini_r, vdomini_f],
  // react: [react_h, react_r, react_f],
  // preact: [preact_h, preact_r, preact_f],
  inferno: [inferno_h, inferno_r, inferno_f],
}

// bench

const bench = async () => {
  for (count of [10_000]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, async () => {
            ;[h, r, Fragment] = cases[c]
            create(count, c)
          }),
        ),
    )
  }
}

;(function run() {
  bench().then(run)
})()
