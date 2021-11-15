import { h, Fragment } from '../src/h'

const SomeComponent = 'can be anything'

const vtree = (
  // no need for a fragment here but just as an example
  <>
    <form>
      <input type="text" />

      <button style={'color:red'} onClick={() => console.log('clicked')}>
        Click me
      </button>

      <SomeComponent />
    </form>
  </>
)

// eslint-disable-next-line @typescript-eslint/no-var-requires
console.log(require('util').inspect(vtree, { colors: true, depth: 10 }))
/* =>

{
  tag: [class Fragment],
  props: null,
  children: [
    {
      tag: 'form',
      props: null,
      children: [
        { tag: 'input', props: { type: 'text' }, children: [] },
        {
          tag: 'button',
          props: { style: 'color:red', onClick: [Function: onClick] },
          children: [ 'Click me' ]
        },
        { tag: 'can be anything', props: null, children: [] }
      ]
    }
  ]
}

*/
