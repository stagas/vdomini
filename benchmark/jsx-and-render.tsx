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

const onClick = () => {
  /* void */
}

const randomly = () => Math.random() - 0.5

const factory = ({ prop, i }: any) => (
  <div key={i} randomattr={i}>
    <span className={prop}>{i}</span>
    and some text
    <input autoFocus={i % 5 === 0} type="text" />
    <img
      crossOrigin="anonymous"
      title="more"
      alt="to make it realistic"
      width="300"
    />
    <div>
      more
      <>
        {Array(count * 2 - i * 2)
          .fill(0)
          .map((_, i: number) => (
            <div key={i}>
              nesting<div>!!!</div>
            </div>
          ))
          .sort(randomly)}
      </>
    </div>
    <ul>
      {Array(i * 2)
        .fill(0)
        .map((_, ii: number) => (
          <li
            key={ii}
            onClick={i % 5 === 0 ? onClick : null}
            style={
              i % 3 !== 0
                ? {
                    width: '200px',
                    height: '50px',
                    color: 'blue',
                    background: 'red',
                    overflow: 'hidden',
                  }
                : { height: '250px', color: 'blue' }
            }
          >
            {i}
          </li>
        ))
        .sort(randomly)}
    </ul>
  </div>
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
    }, 0)
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

const testAllEqual = () => {
  let prev
  for (const c in cases) {
    ;[h, r, Fragment] = cases[c]
    count = 10
    create(1, c)
    const html = document.body.innerHTML
    if (prev && prev !== html) {
      console.error(prev)
      console.error(html)
      throw new Error('Not equal: ' + c)
    }
    prev = html
  }
}

// testAllEqual()

// bench

const bench = async () => {
  for (count of [200]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, async () => {
            ;[h, r, Fragment] = cases[c]
            create(count, c)
          })
        )
    )
  }
}

;(function run() {
  bench().then(run)
})()
