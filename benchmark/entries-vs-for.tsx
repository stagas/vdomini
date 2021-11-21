/* eslint-disable @typescript-eslint/no-explicit-any */
import { suite, add } from 'benny-vipu'

const entries = Array(10000)
  .fill(0)
  .map((_, i) => [i, { prop: i }]) as [number, { prop: number }][]

// cases

const cases: any = {
  entries: (count: number) => {
    let r
    for (let x = 0; x < count; x++) {
      for (const item of entries) {
        r = item[0] * 5
      }
    }
    return r
  },

  for: (count: number) => {
    let r
    for (let x = 0; x < count; x++) {
      for (let i = 0; i < entries.length; i++) {
        const item = entries[i]
        r = item[0] * 5
      }
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
  for (const count of [100]) {
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
