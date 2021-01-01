import React, { useState, useEffect, useMemo } from 'react'
import { createStore } from 'redux'

import Header from './Header'
import AddTodo from './AddTodo'
import TodoList from './TodoList'
import TodoFilter from './TodoFilter'
import StateContext from './StateContext'

import { fetchAPITodos } from './api'
import appReducer from './reducers'

const initialState = { todos: [], filter: 'all' }
const store = createStore(appReducer, initialState)
const { dispatch } = store

export default function App () {
  const [ state, setState ] = useState(initialState)
  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getState()))
    return unsubscribe
  }, [])

  useEffect(() => {
    fetchAPITodos().then((todos) =>
      dispatch({ type: 'FETCH_TODOS', todos })
    )
  }, [])

  const filteredTodos = useMemo(() => {
    const { filter, todos } = state
    switch (filter) {
      case 'active':
        return todos.filter(t => t.completed === false)
      
      case 'completed':
        return todos.filter(t => t.completed === true)
      
      default:
      case 'all':
        return todos
    }
  }, [ state ])

  function addTodo (title) {
    dispatch({ type: 'ADD_TODO', title })
  }

  function toggleTodo (id) {
    dispatch({ type: 'TOGGLE_TODO', id })
  }

  function removeTodo (id) {
    dispatch({ type: 'REMOVE_TODO', id })
  }

  function filterTodos (filter) {
    dispatch({ type: 'FILTER_TODOS', filter })
  }

  return (
    <StateContext.Provider value={filteredTodos}>
      <div style={{ width: 400 }}>
        <Header />
        <AddTodo addTodo={addTodo} />
        <hr />
        <TodoList toggleTodo={toggleTodo} removeTodo={removeTodo} />
        <hr />
        <TodoFilter filter={state.filter} filterTodos={filterTodos} />
      </div>
    </StateContext.Provider>
  )
}
