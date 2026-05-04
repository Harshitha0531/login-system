import { useState } from 'react'
import tick from '../assets/tick.png'
import not_tick from '../assets/not_tick.png'
import delete_icon from '../assets/delete.png'

const TodoItems = ({ text, id, isComplete, deleteTodo, toggle, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  const handleEdit = () => {
    if (editText.trim() && editText !== text) {
      editTodo(id, editText.trim())
    }
    setIsEditing(false)
  }

  return (
    <div className='flex items-center my-3 gap-2'>
      <div onClick={() => !isEditing && toggle(id)} className='flex flex-1 items-center cursor-pointer'>
        <img src={isComplete ? tick : not_tick} alt="" className='w-7 cursor-pointer flex-shrink-0' />
        {isEditing ? (
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            onClick={(e) => e.stopPropagation()}
            className='ml-4 flex-1 border-b border-blue-400 outline-none text-[17px] text-slate-700 bg-transparent'
          />
        ) : (
          <p className={`text-slate-700 ml-4 text-[17px] decoration-slate-500 ${isComplete ? 'line-through text-gray-400' : ''}`}>
            {text}
          </p>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {!isComplete && (
          <span
            onClick={() => setIsEditing(true)}
            className='text-xs text-blue-400 hover:text-blue-600 cursor-pointer'
          >
            ✏️
          </span>
        )}
        <img onClick={() => deleteTodo(id)} src={delete_icon} alt="" className='w-3.5 cursor-pointer' />
      </div>
    </div>
  )
}

export default TodoItems
