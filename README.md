<h1 align="center">&lt;/&gt;<br>vdomini</h1>

<p align="center">
mini jsx virtual dom
</p>

<p align="center">
   <a href="#install">        🔧 <strong>Install</strong></a>
 · <a href="#example">        🧩 <strong>Example</strong></a>
 · <a href="#api">            📜 <strong>API docs</strong></a>
 · <a href="https://github.com/stagas/vdomini/releases"> 🔥 <strong>Releases</strong></a>
 · <a href="#contribute">     💪🏼 <strong>Contribute</strong></a>
 · <a href="https://github.com/stagas/vdomini/issues">   🖐️ <strong>Help</strong></a>
</p>

***

## Install

```sh
$ npm i vdomini
```

Or directly from [jsDelivr](https://www.jsdelivr.com/):

```tsx
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, render } from 'https://cdn.jsdelivr.net/gh/stagas/vdomini/vdomini.min.js'
```

## Goals

*   Minimal-to-zero API.

*   **Fast. Stable. Predictable.**

*   **No surprises!**

*   **Compact. Readable. Hackable.**

*   **Minimal error surface -** With code that tries to do as little as possible there can only be a handful of ways that
    something can go wrong and when it does it won't be because *"issue [#47665](https://www.youtube.com/watch?v=dQw4w9WgXcQ)"* hasn't been resolved yet.

*   When an error occurs you can **inspect** it, you're always one navigation away from its [*readable source code*](src/render.ts)
    and the understanding of what caused it and possibly ***how to solve it***.

*   **No bells and whistles -** All operations are as close as possible to the **Real DOM(tm)**. No fibers, monads,
    queues, portals, no tons of layers of complexity between your ***intention*** and the ***operation***.

*   **No learning curve -** You already know how to write HTML and to manipulate it using JavaScript.
    This is only abstracting ***a few*** DOM operations, which you also already know.

*   **No setup -** There are no plugins, transformers, transpilations that you need to learn or specific tools
    you need to use, besides TypeScript, which is excellent.
    If you're setup with TypeScript, then this is simply one npm install away. ***It's more like a library than a framework.***

## Features

*   **Fast.**
*   **Tiny.** 1.5kb brotli.
*   **JSX** with **virtual dom**.
*   **Functional components** with props, like usual from React.
*   **Keyed lists** with ***fast*** reconciliation only touching the items that changed.
*   **Refs -** Passing any object to the `ref` attribute will be injected a `current` property that corresponds
    to the live dom element.
*   **Reactive Hooks -** Only the function component and its children where the hook was captured are going to be rerendered when it triggers.
*   **BYOB -** The hook API is simply holding a reference and using the trigger function. Any kind of hook can be implemented
    using these primitives. [The very basic ones](src/hooks.ts) are included simply for convenience and as an example.

## Example

```tsx
/** @jsx h */
/** @jsxFrag Fragment */

import { h, Fragment, render, useCallback } from 'vdomini'

let count = 0

const Counter = ({ count }) => {
  const inc = useCallback(() => count++)
  const dec = useCallback(() => count--)
  return (
    <>
      count is: {count}
      <br />
      <button onclick={inc}>increase</button>
      <button onclick={dec}>decrease</button>
    </>
  )
}

render(<Counter {...state} />, document.body)
```

A more complete example can be seen [here](example/todo-app/todo-app.tsx).

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [render](#render)
    *   [Parameters](#parameters)
*   [useHook](#usehook)
*   [useCallback](#usecallback)
    *   [Parameters](#parameters-1)
*   [trigger](#trigger)
    *   [Parameters](#parameters-2)
*   [VHook](#vhook)
*   [current](#current)
    *   [hook](#hook)
*   [h](#h)
    *   [Parameters](#parameters-3)
*   [Fragment](#fragment)
*   [FunctionalComponent](#functionalcomponent)
    *   [Parameters](#parameters-4)
*   [VNode](#vnode)
*   [VType](#vtype)
*   [VProps](#vprops)
*   [VChild](#vchild)

### render

[src/render.ts:568-570](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/render.ts#L568-L570 "Source code on GitHub")

Renders a virtual node on an html Element.

```tsx
render(<p>hello world</p>, document.body)
```

#### Parameters

*   `vNode` **[VNode](#vnode)** The virtual node to render
*   `el` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** The target element to render on

### useHook

[src/hooks.ts:20-26](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/hooks.ts#L20-L26 "Source code on GitHub")

Returns a callback that will trigger
a rerender on the current component.

```tsx
let clicked = 0
const Foo = () => <>
  {clicked++}
  <button onclick={useHook()}>click me</button>
</>
```

Returns **any** The hook callback

### useCallback

[src/hooks.ts:46-53](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/hooks.ts#L46-L53 "Source code on GitHub")

Wraps a function along with a hook
so when called will also trigger that hook.

```tsx
let clicked = 0
const Foo = () => {
  const inc = useCallback(() => clicked++)
  return <>
    {clicked}
    <button onclick={inc}>click me</button>
  </>
}
```

#### Parameters

*   `fn` **function (...args: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)\<any>): void** Any function to wrap with the hook

Returns **any** The callback function

### trigger

[src/render.ts:534-550](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/render.ts#L534-L550 "Source code on GitHub")

Triggers a rerender on a hook.

```tsx
let hook
const Foo = () => {
  hook = current.hook
  return <p>{content}</p>
}
render(<Foo />, c)
trigger(hook)
```

#### Parameters

*   `hook` **[VHook](#vhook)** The hook to trigger

### VHook

[src/render.ts:18-23](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/render.ts#L18-L23 "Source code on GitHub")

A hook that enables reactive programming. It can
be obtained using the export [current.hook](#hook)
from inside a functional component and triggered
using `trigger(hook)`.

### current

[src/render.ts:511-517](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/render.ts#L511-L517 "Source code on GitHub")

The `current` singleton.

Type: Current

#### hook

[src/render.ts:516-516](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/render.ts#L516-L516 "Source code on GitHub")

Holds a reference to a hook that can
be triggered later using [trigger](#trigger).

### h

[src/h.ts:103-107](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L103-L107 "Source code on GitHub")

The virtual node JSX factory. Returns the tree of the node and its children.

```tsx
const vNode = h('p', { align: 'center' }, ['hello', 'world'])
```

#### Parameters

*   `type` **any** The element type of the virtual node to be constructed.
*   `props` **any?** A props object with arbitrary values.
*   `children` **...any** A [VNode](#vnode).

Returns **[VNode](#vnode)**&#x20;

### Fragment

[src/h.ts:90-90](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L90-L90 "Source code on GitHub")

Fragment symbol for JSX fragments <>\</>.

### FunctionalComponent

[src/h.ts:83-85](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L83-L85 "Source code on GitHub")

Functional component interface.

```ts
const vNode = h(() => ({ type: 'p', props: null, children: ['hello'] }))
```

#### Parameters

*   `props`  The properties passed to the component

Returns **any** The computed VNode.

### VNode

[src/h.ts:67-71](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L67-L71 "Source code on GitHub")

A virtual dom node.

### VType

[src/h.ts:52-52](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L49-L51 "Source code on GitHub")

The VNode type.

Type: ([FunctionalComponent](#functionalcomponent) | CustomElementConstructor | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [symbol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol))

### VProps

[src/h.ts:57-57](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L54-L56 "Source code on GitHub")

VNode propeties.

Type: (Record<[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), any> | null | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))

### VChild

[src/h.ts:62-62](https://github.com/stagas/vdomini/blob/e9ee1b7c5eb57685e41bb2a46730fc9544b30a5b/src/h.ts#L59-L61 "Source code on GitHub")

A VNode child.

Type: ([VNode](#vnode) | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) | [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number) | [boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))

## Recipes

Getting a reference to an element when it is created inside the component:

```tsx
const Component = () => {
  const ref = {
    set current(el) {
      // el is now the div below
      // here we can attach event listeners,
      // mutation observers etc.
    },
  }
  return <div ref={ref}></div>
}
```

## Contribute

[Fork](https://github.com/stagas/vdomini/fork) or
[edit](https://github.dev/stagas/vdomini) and submit a PR.

All contributions are welcome!

## License

MIT © 2021
[stagas](https://github.com/stagas)
