import { useState, useEffect, useRef } from 'react'
import todo_icon from '../assets/todo_icon.png'
import TodoItems from './TodoItems'
import api from '../api'

const TodoList = () => {
  const [todoList, setTodoList] = useState([])
  const inputRef = useRef()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos')
      setTodoList(res.data)
    } catch (err) {
      console.log('Failed to fetch todos', err)
    }
  }

  const add = async () => {
    const inputText = inputRef.current.value.trim()
    if (!inputText) return

    try {
      const res = await api.post('/todos', { text: inputText })
      setTodoList((prev) => [res.data, ...prev])
      inputRef.current.value = ''
    } catch (err) {
      console.log('Failed to add todo', err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`)
      setTodoList((prev) => prev.filter((todo) => todo._id !== id))
    } catch (err) {
      console.log('Failed to delete todo', err)
    }
  }

  const toggle = async (id) => {
    const todo = todoList.find((t) => t._id === id)
    try {
      const res = await api.patch(`/todos/${id}`, { completed: !todo.completed })
      setTodoList((prev) => prev.map((t) => (t._id === id ? res.data : t)))
    } catch (err) {
      console.log('Failed to toggle todo', err)
    }
  }

  const editTodo = async (id, newText) => {
    try {
      const res = await api.patch(`/todos/${id}`, { text: newText })
      setTodoList((prev) => prev.map((t) => (t._id === id ? res.data : t)))
    } catch (err) {
      console.log('Failed to edit todo', err)
    }
  }

  const completed = todoList.filter((t) => t.completed).length
  const total = todoList.length

  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl'>
      <div className='flex items-center mt-7 gap-2'>
        <img className='w-8' src={todo_icon} alt="" />
        <h1 className='text-3xl font-semibold'>Todo List</h1>
      </div>

      {total > 0 && (
        <div className='mt-4'>
          <div className='flex justify-between text-xs text-gray-500 mb-1'>
            <span>{completed} of {total} tasks completed</span>
            <span>{Math.round((completed / total) * 100)}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-1.5'>
            <div
              className='bg-blue-600 h-1.5 rounded-full transition-all duration-500'
              style={{ width: `${(completed / total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      <div className='flex items-center my-7 border border-gray-300 rounded-full overflow-hidden'>
        <input
          ref={inputRef}
          className='bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-400 text-sm'
          type='text'
          placeholder='Add your task'
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button
          onClick={add}
          className='border-none rounded-full bg-blue-600 hover:bg-blue-700 w-32 h-14 text-white text-sm font-medium cursor-pointer transition'
        >
          ADD +
        </button>
      </div>
      <div>
        {todoList.length === 0 && (
          <p className='text-center text-gray-400 text-sm py-6'>No tasks yet. Add one above!</p>
        )}
        {todoList.map((item) => (
          <TodoItems
            key={item._id}
            text={item.text}
            id={item._id}
            isComplete={item.completed}
            deleteTodo={deleteTodo}
            toggle={toggle}
            editTodo={editTodo}
          />
        ))}
      </div>
    </div>
  )
}

export default TodoList
