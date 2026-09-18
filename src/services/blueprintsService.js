import apimock from './apimock.js'
import apiClient from './apiClient.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true

const blueprintsService = useMock ? apimock : apiClient

export default blueprintsService
