/* eslint-disable @typescript-eslint/no-unused-vars */

import { suite, add } from 'benny-vipu'

const a = Array(5)
  .fill(0)
  .map((_, i) => [i, { prop: i }]) as [number, { prop: number }][]
const b = Array(5)
  .fill(0)
  .map((_, i) => [i, { prop: i }]) as [number, { prop: number }][]

// cases

const cases: any = {
  push: (count: number) => {
    const r = []
    for (let x = 0; x < count; x++) {
      r.push(...a)
    }
    return r
  },

  splice: (count: number) => {
    const r: any = []
    for (let x = 0; x < count; x++) {
      r.splice(r.length, 0, ...a)
    }
    return r
  },

  // for_let: (count: number) => {
  //   let r
  //   for (let x = 0; x < count; x++) {
  //     for (let i = 0, item; i < entries.length; i++) {
  //       item = entries[i]
  //       r = item[0] * i
  //     }
  //   }
  //   return r
  // },

  // while: (count: number) => {
  //   let r
  //   for (let x = 0; x < count; x++) {
  //     let i = 0
  //     let item
  //     do {
  //       item = entries[i]
  //       r = item[0] * i
  //     } while (++i < entries.length)
  //   }
  //   return r
  // },
}

// bench

const bench = async () => {
  for (const count of [500]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, () => {
            cases[c](count)
          }),
        ),
    )
  }
}

;(function run() {
  bench().then(run)
})()
