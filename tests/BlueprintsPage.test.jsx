import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import BlueprintsPage from '../src/pages/BlueprintsPage.jsx'

// Mock de thunks del slice para no requerir backend
vi.mock('../src/features/blueprints/blueprintsSlice.js', () => ({
  fetchAuthors: () => ({ type: 'blueprints/fetchAuthors' }),
  fetchByAuthor: (author) => ({ type: 'blueprints/fetchByAuthor', payload: author }),
  fetchBlueprint: (payload) => ({ type: 'blueprints/fetchBlueprint', payload }),
}))

function makeStore(preloaded) {
  const slice = createSlice({
    name: 'blueprints',
    initialState: {
      authors: [],
      byAuthor: {},
      current: null,
      status: 'idle',
      error: null,
      ...preloaded,
    },
    reducers: {},
  })
  return configureStore({ reducer: { blueprints: slice.reducer } })
}

describe('BlueprintsPage', () => {
  it('despacha fetchByAuthor al hacer click en Get blueprints', () => {
    const store = makeStore()
    const spy = vi.spyOn(store, 'dispatch')
    render(
      <Provider store={store}>
        <BlueprintsPage />
      </Provider>,
    )

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'JohnConnor' } })
    fireEvent.click(screen.getByText(/Get blueprints/i))

    expect(spy).toHaveBeenCalledWith({ type: 'blueprints/fetchByAuthor', payload: 'JohnConnor' })
  })

  it('muestra la tabla de planos, puntos y total de puntos del autor', () => {
    const store = makeStore({
      byAuthor: {
        johnconnor: [
          { author: 'johnconnor', name: 'house', points: [{ x: 10, y: 10 }, { x: 20, y: 20 }] },
          { author: 'johnconnor', name: 'gear', points: [{ x: 30, y: 30 }] },
        ],
      },
    })

    render(
      <Provider store={store}>
        <BlueprintsPage />
      </Provider>,
    )

    // Seleccionar autor
    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'johnconnor' } })
    fireEvent.click(screen.getByText(/Get blueprints/i))

    expect(screen.getByText('house')).toBeInTheDocument()
    expect(screen.getByText('gear')).toBeInTheDocument()
    expect(screen.getByText('Total user points: 3')).toBeInTheDocument()
  })

  it('despacha fetchBlueprint al presionar Open en un plano', () => {
    const store = makeStore({
      byAuthor: {
        johnconnor: [
          { author: 'johnconnor', name: 'house', points: [{ x: 10, y: 10 }] },
        ],
      },
    })
    const spy = vi.spyOn(store, 'dispatch')

    render(
      <Provider store={store}>
        <BlueprintsPage />
      </Provider>,
    )

    fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'johnconnor' } })
    fireEvent.click(screen.getByText(/Get blueprints/i))

    const openBtn = screen.getByText('Open')
    fireEvent.click(openBtn)

    expect(spy).toHaveBeenCalledWith({
      type: 'blueprints/fetchBlueprint',
      payload: { author: 'johnconnor', name: 'house' },
    })
  })

  it('muestra el nombre del plano actual y renderiza el canvas', () => {
    const store = makeStore({
      current: {
        author: 'johnconnor',
        name: 'house',
        points: [
          { x: 140, y: 140 },
          { x: 115, y: 115 },
        ],
      },
    })

    const { container } = render(
      <Provider store={store}>
        <BlueprintsPage />
      </Provider>,
    )

    expect(screen.getByText(/Current blueprint: house/i)).toBeInTheDocument()
    const canvas = container.querySelector('#blueprint-canvas')
    expect(canvas).toBeInTheDocument()
  })
})
