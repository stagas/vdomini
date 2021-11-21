/* eslint-disable @typescript-eslint/no-explicit-any */
import { suite, add } from 'benny-vipu'

const entries = Array(10000)
  .fill(0)
  .map((_, i) => [i, { prop: i }]) as [number, { prop: number }][]
const obj = Object.fromEntries(entries.map(([i, e]) => [i, e.prop]))
const obj_prop = Object.fromEntries(entries)
// const map = new Map<number, { prop: number }>(entries)

// cases

const cases: any = {
  // map: (count: number) => {
  //   let r
  //   for (let i = 0; i < count; i++) {
  //     r = map.get(entries[i % entries.length][0])
  //   }
  //   return r
  // },

  obj: (count: number) => {
    let r
    for (let i = 0; i < count; i++) {
      r = obj[entries[i % entries.length][0]]
    }
    return r
  },

  obj_prop: (count: number) => {
    let r
    for (let i = 0; i < count; i++) {
      r = obj_prop[entries[i % entries.length][0]].prop
    }
    return r
  },
}

// bench

const bench = async () => {
  for (const count of [100_000]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, () => {
            cases[c](count)
          })
        )
    )
  }
}

;(function run() {
  bench().then(run)
})()
