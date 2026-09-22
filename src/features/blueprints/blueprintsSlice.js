import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const data = await blueprintsService.getAll()
  const authors = [...new Set(data.map((bp) => bp.author))]
  return authors
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const data = await blueprintsService.getByAuthor(author)
  return { author, items: data }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const data = await blueprintsService.getByAuthorAndName(author, name)
    return data
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  const data = await blueprintsService.create(payload)
  return data
})

export const updateBlueprint = createAsyncThunk('blueprints/updateBlueprint', async ({ author, name, point }) => {
  const data = await blueprintsService.update(author, name, point)
  return data
})

export const deleteBlueprint = createAsyncThunk('blueprints/deleteBlueprint', async ({ author, name }) => {
  await blueprintsService.deleteBlueprint(author, name)
  return { author, name }
})

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentBlueprint: (state) => {
      state.current = null
    },
    addPointToCurrent: (state, action) => {
      if (state.current) {
        state.current.points.push(action.payload)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(fetchByAuthor.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(fetchBlueprint.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        const bp = a.payload
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
      })
      .addCase(updateBlueprint.fulfilled, (s, a) => {
        const bp = a.payload
        if (s.byAuthor[bp.author]) {
          const idx = s.byAuthor[bp.author].findIndex(b => b.name === bp.name)
          if (idx !== -1) s.byAuthor[bp.author][idx] = bp
        }
        if (s.current && s.current.name === bp.name && s.current.author === bp.author) {
          s.current = bp
        }
      })
      .addCase(deleteBlueprint.fulfilled, (s, a) => {
        const { author, name } = a.payload
        if (s.byAuthor[author]) {
          s.byAuthor[author] = s.byAuthor[author].filter(b => b.name !== name)
        }
        if (s.current && s.current.name === name && s.current.author === author) {
          s.current = null
        }
      })
  },
})

export const selectTop5Blueprints = createSelector(
  [(state) => state.blueprints.byAuthor],
  (byAuthor) => {
    const allBps = []
    Object.values(byAuthor).forEach((bps) => {
      if (Array.isArray(bps)) {
        allBps.push(...bps)
      } else if (bps && typeof bps === 'object') {
        allBps.push(...Object.values(bps))
      }
    })
    return allBps
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5)
  }
)

export const { clearCurrentBlueprint, addPointToCurrent } = slice.actions
export default slice.reducer
