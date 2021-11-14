/* eslint-disable @typescript-eslint/no-explicit-any */

import { suite, add } from 'benny-vipu'
import { h as vdomini } from '../src'

let h

const factory = ({ prop, i }: any) => (
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

const create = (count: number) => {
  let c
  for (let i = 0; i < count; i++) {
    c = factory({ prop: 'foo', i })
  }
  return c
}

const cases: any = {
  pass_through: (...args: any[]) => args,

  hidden_classes: (tag: any, props: any, ...children: any[]) => ({
    tag,
    props,
    children,
  }),

  vdomini,
}

// bench

const bench = async () => {
  for (const count of [10_000, 1_000_000]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, () => {
            h = cases[c]
            create(count)
          }),
        ),
    )
  }
}

;(function run() {
  bench().then(run)
})()
