/** @jsx h */
/** @jsxFrag Fragment */

import { h, Fragment, render, current, trigger } from 'vdomini'

const useCallback = (fn: () => void) => {
  const hook = useHook()
  debugger
  return () => {
    fn()
    hook()
  }
}

const useHook = () => {
  const hook = current.hook
  return () => trigger(hook!)
}

let inputValue = ''

const main = {
  id: 0,
  priority: 'chore',
}

type Todo = { id: number; text: string; priority: string }

type PriorityTarget = { id: number; priority: string }

const TodoItem = ({ todo }: { todo: Todo }) => (
  <li>
    {todo.text} {todo.priority === 'important' && '!!!'}
    <PrioritySelect target={todo} onchange={useHook()} />
  </li>
)

const PrioritySelect = ({
  target,
  onchange,
}: {
  target: PriorityTarget
  onchange?: () => void
}) => {
  return (
    <>
      <PriorityRadio target={target} onchange={onchange} value="important" />
      <PriorityRadio target={target} onchange={onchange} value="chore" />
    </>
  )
}

const PriorityRadio = ({
  value,
  target,
  onchange,
}: {
  value: string
  target: PriorityTarget
  onchange?: () => void
}) => (
  <label>
    {value}
    <input
      type="radio"
      name={'priority' + target.id}
      value={value}
      onchange={() => ((target.priority = value), onchange?.())}
      checked={target.priority === value}
    />
  </label>
)

const inputRef: { current?: HTMLInputElement } = {}

const TodoApp = ({ todos }: { todos: Todo[] }) => {
  const addTodo = useCallback(() => {
    todos.unshift({
      id: Math.random(),
      text: inputValue,
      priority: main.priority,
    })

    main.priority = 'chore'
    inputValue = ''
    inputRef.current!.focus()
  })

  return (
    <>
      <h1>My Todo App</h1>
      <input
        ref={inputRef}
        type="string"
        value={inputValue}
        autofocus
        oninput={(e: InputEvent) => {
          inputValue = inputRef.current!.value
        }}
        onkeydown={(e: KeyboardEvent) => {
          e.key === 'Enter' && addTodo()
        }}
      />
      <PrioritySelect target={main} />
      <button onclick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  )
}

const todos: Todo[] = []

const update = () => render(<TodoApp todos={todos} />, document.body)

update()
