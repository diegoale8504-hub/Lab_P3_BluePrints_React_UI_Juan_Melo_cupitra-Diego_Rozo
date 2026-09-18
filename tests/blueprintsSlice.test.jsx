import { describe, it, expect } from 'vitest'
import reducer, {
  clearCurrentBlueprint,
  fetchByAuthor,
  fetchBlueprint,
} from '../src/features/blueprints/blueprintsSlice.js'

describe('blueprints slice', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.authors).toEqual([])
    expect(state.byAuthor).toEqual({})
    expect(state.current).toBeNull()
    expect(state.status).toBe('idle')
    expect(state.error).toBeNull()
  })

  it('should handle fetchByAuthor.fulfilled', () => {
    const previousState = {
      authors: [],
      byAuthor: {},
      current: null,
      status: 'loading',
      error: null,
    }
    const payload = {
      author: 'johnconnor',
      items: [{ name: 'house', points: [{ x: 10, y: 10 }] }],
    }
    const state = reducer(previousState, fetchByAuthor.fulfilled(payload))
    expect(state.status).toBe('succeeded')
    expect(state.byAuthor['johnconnor']).toEqual(payload.items)
  })

  it('should handle fetchBlueprint.fulfilled', () => {
    const previousState = {
      authors: [],
      byAuthor: {},
      current: null,
      status: 'loading',
      error: null,
    }
    const payload = {
      author: 'johnconnor',
      name: 'house',
      points: [{ x: 10, y: 10 }],
    }
    const state = reducer(previousState, fetchBlueprint.fulfilled(payload))
    expect(state.status).toBe('succeeded')
    expect(state.current).toEqual(payload)
  })

  it('should handle clearCurrentBlueprint', () => {
    const previousState = {
      authors: [],
      byAuthor: {},
      current: { name: 'house' },
      status: 'succeeded',
      error: null,
    }
    const state = reducer(previousState, clearCurrentBlueprint())
    expect(state.current).toBeNull()
  })
})
