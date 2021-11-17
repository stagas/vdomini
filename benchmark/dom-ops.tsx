import { suite, add } from 'benny-vipu'

const COUNT = 20_000

// class Node {
//   right: Node
//   data: any
//   constructor(data, right) {
//     this.data = data
//     this.right = right
//   }
// }

// let head
// {
//   console.time('innerhtml')
//   document.body.innerHTML = '<div></div>'.repeat(COUNT)
//   console.timeEnd('innerhtml')
//   let el = document.body.lastChild
//   let node = (head = new Node(el))
//   console.time('create list')
//   while ((el = el.prevSibling)) node = head = new Node(el, node)
//   console.timeEnd('create list')
// }

// cases

const cases: any = {
  // nextSibling: (count: number) => {
  //   document.body.innerHTML = '<div></div>'.repeat(count)
  //   let el: any = document.body.firstChild
  //   const result: any = []
  //   while ((el = el.nextSibling)) result.push(el)
  // },

  // prepend: (count: number) => {
  //   document.body.innerHTML = ''

  //   for (let i = 0; i < count; i++) {

  //     document.body.prepend(document.createElement('div'))
  //   }
  // },

  // append: (count: number) => {
  //   document.body.innerHTML = ''

  //   for (let i = 0; i < count; i++) {
  //     document.body.append(document.createElement('div'))
  //   }
  // },

  // appendChild: (count: number) => {
  //   document.body.innerHTML = ''

  //   for (let i = 0; i < count; i++) {
  //     document.body.appendChild(document.createElement('div'))
  //   }
  // },

  insertBefore: (count: number) => {
    document.body.innerHTML = '<div></div>'
    for (let i = 0; i < count; i++) {
      document.body.insertBefore(
        document.createElement('div'),
        document.body.childNodes[
          (Math.random() * document.body.childNodes.length) | 0
        ],
      )
    }
  },

  after: (count: number) => {
    document.body.innerHTML = '<div></div>'
    let el = document.body.firstChild
    for (let i = 0; i < count; i++) {
      document.body.childNodes[
        (Math.random() * document.body.childNodes.length) | 0
      ].after(document.createElement('div'))
    }
  },

  before: (count: number) => {
    document.body.innerHTML = '<div></div>'
    let el = document.body.firstChild
    for (let i = 0; i < count; i++) {
      document.body.childNodes[
        (Math.random() * document.body.childNodes.length) | 0
      ].before(document.createElement('div'))
    }
  },
  // linkedList: (count: number) => {
  //   let el: any = head
  //   const result: any = []
  //   while ((el = el.right)) result.push(el)
  // },

  // prevSibling: (count: number) => {
  //   let el: any = document.body.lastChild
  //   const result: any = []
  //   while ((el = el.prevSibling)) result.push(el)
  // },

  // forChildNodes: (count: number) => {
  //   document.body.innerHTML = '<div></div>'.repeat(count)

  //   const childNodes = document.body.childNodes
  //   const result: any = []
  //   const length = childNodes.length
  //   for (let i = 0; i < length; i++) {
  //     result.push(childNodes[i])
  //   }
  // },

  // treeWalker: (count: number) => {
  //   document.body.innerHTML = '<div></div>'.repeat(count)

  //   const tree = document.createTreeWalker(
  //     document.body,
  //     NodeFilter.SHOW_ELEMENT,
  //   )
  //   const result: any = []
  //   let el: any
  //   while ((el = tree.nextNode())) result.push(el)
  // },
}

// bench

const bench = async () => {
  for (const count of [COUNT]) {
    await suite(
      `${count} iterations`,

      ...Object.keys(cases)
        .sort(() => Math.random() - 0.5)
        .map(c =>
          add(c, () => {
            console.time(c)
            // for (let i = 0; i < count * 1; i++) {
            cases[c](count)
            // }
            console.timeEnd(c)
          }),
        ),
    )
  }
}

;(function run() {
  bench().then(run)
})()
