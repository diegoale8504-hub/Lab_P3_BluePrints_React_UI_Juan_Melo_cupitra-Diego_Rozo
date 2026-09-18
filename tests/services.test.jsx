import { describe, it, expect } from 'vitest'
import apimock from '../src/services/apimock.js'
import blueprintsService from '../src/services/blueprintsService.js'

describe('Servicios - apimock y blueprintsService (Requerimiento 4)', () => {
  it('apimock implementa los 4 métodos requeridos: getAll, getByAuthor, getByAuthorAndName, create', () => {
    expect(typeof apimock.getAll).toBe('function')
    expect(typeof apimock.getByAuthor).toBe('function')
    expect(typeof apimock.getByAuthorAndName).toBe('function')
    expect(typeof apimock.create).toBe('function')
  })

  it('apimock.getAll retorna todos los blueprints simulados', async () => {
    const all = await apimock.getAll()
    expect(Array.isArray(all)).toBe(true)
    expect(all.length).toBeGreaterThanOrEqual(4)
  })

  it('apimock.getByAuthor retorna los planos del autor consultado', async () => {
    const authorPlans = await apimock.getByAuthor('johnconnor')
    expect(authorPlans.length).toBe(2)
    expect(authorPlans.map((p) => p.name)).toEqual(['house', 'gear'])
  })

  it('apimock.getByAuthorAndName retorna el plano específico', async () => {
    const bp = await apimock.getByAuthorAndName('johnconnor', 'house')
    expect(bp.name).toBe('house')
    expect(bp.author).toBe('johnconnor')
    expect(bp.points.length).toBeGreaterThan(0)
  })

  it('apimock.create añade un nuevo plano en memoria', async () => {
    const newBp = {
      author: 'testauthor',
      name: 'testblueprint',
      points: [{ x: 10, y: 10 }],
    }
    const created = await apimock.create(newBp)
    expect(created.name).toBe('testblueprint')

    const fetched = await apimock.getByAuthor('testauthor')
    expect(fetched.some((p) => p.name === 'testblueprint')).toBe(true)
  })

  it('blueprintsService expone la misma interfaz y utiliza apimock cuando VITE_USE_MOCK=true', async () => {
    expect(typeof blueprintsService.getAll).toBe('function')
    expect(typeof blueprintsService.getByAuthor).toBe('function')
    expect(typeof blueprintsService.getByAuthorAndName).toBe('function')
    expect(typeof blueprintsService.create).toBe('function')

    const data = await blueprintsService.getByAuthor('johnconnor')
    expect(data.length).toBeGreaterThan(0)
  })
})
