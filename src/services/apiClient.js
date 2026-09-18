import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 8000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(err)
  },
)

const apiClient = {
  getAll: async () => {
    const { data } = await api.get('/blueprints')
    return data
  },
  getByAuthor: async (author) => {
    const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
    return data
  },
  getByAuthorAndName: async (author, name) => {
    const { data } = await api.get(
      `/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    return data
  },
  create: async (blueprint) => {
    const { data } = await api.post('/blueprints', blueprint)
    return data
  },
  // Métodos axios delegados para compatibilidad
  get: api.get.bind(api),
  post: api.post.bind(api),
  put: api.put.bind(api),
  delete: api.delete.bind(api),
}

export default apiClient
