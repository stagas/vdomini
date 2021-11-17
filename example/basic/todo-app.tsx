/** @jsx h */
/** @jsxFrag Fragment */

import { h, Fragment, render } from 'vdomini'

let inputValue = ''
let priority = 'chore'

type Todo = { id: number; text: string; priority: string }

const addTodo = () => {
  todos.unshift({
    id: Math.random(),
    text: inputValue,
    priority,
  })

  inputValue = ''
  priority = 'chore'

  update()
}

const TodoItem = ({ text, priority }: { text: string; priority: string }) => (
  <li>
    {text} {priority === 'important' && '!!!'}
  </li>
)

const PriorityRadio = ({ value }: { value: string }) => (
  <label>
    {value}
    <input
      type="radio"
      name="priority"
      value={value}
      onChange={() => (priority = value)}
      checked={priority === value}
    />
  </label>
)

const inputRef = {}

const TodoApp = ({ todos }: { todos: Todo[] }) => (
  <>
    <h1>My Todo App</h1>
    <input
      ref={inputRef}
      type="string"
      value={inputValue}
      autoFocus
      onInput={(e: InputEvent) => {
        inputValue = (e.target as HTMLInputElement).value
      }}
      onKeyDown={(e: KeyboardEvent) => {
        e.key === 'Enter' && addTodo()
      }}
    />
    <PriorityRadio value="important" />
    <PriorityRadio value="chore" />
    <button onClick={addTodo}>Add Todo</button>
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  </>
)

const todos: Todo[] = []

const update = () => render(<TodoApp todos={todos} />, document.body)

update()
