let mockBlueprints = [
  {
    author: 'johnconnor',
    name: 'house',
    points: [
      { x: 140, y: 140 },
      { x: 115, y: 115 },
      { x: 115, y: 140 },
      { x: 140, y: 140 },
      { x: 200, y: 140 },
      { x: 200, y: 240 },
      { x: 140, y: 240 },
      { x: 140, y: 140 },
    ],
  },
  {
    author: 'johnconnor',
    name: 'gear',
    points: [
      { x: 200, y: 100 },
      { x: 220, y: 150 },
      { x: 270, y: 150 },
      { x: 230, y: 180 },
      { x: 250, y: 230 },
      { x: 200, y: 200 },
      { x: 150, y: 230 },
      { x: 170, y: 180 },
      { x: 130, y: 150 },
      { x: 180, y: 150 },
      { x: 200, y: 100 },
    ],
  },
  {
    author: 'maryweasley',
    name: 'cinema',
    points: [
      { x: 100, y: 100 },
      { x: 100, y: 250 },
      { x: 350, y: 250 },
      { x: 350, y: 100 },
      { x: 100, y: 100 },
    ],
  },
  {
    author: 'maryweasley',
    name: 'tower',
    points: [
      { x: 250, y: 50 },
      { x: 200, y: 300 },
      { x: 300, y: 300 },
      { x: 250, y: 50 },
    ],
  },
]

const apimock = {
  getAll: async () => {
    return structuredClone(mockBlueprints)
  },
  getByAuthor: async (author) => {
    if (!author) return []
    return structuredClone(
      mockBlueprints.filter(
        (bp) => bp.author.toLowerCase() === author.trim().toLowerCase(),
      ),
    )
  },
  getByAuthorAndName: async (author, name) => {
    const bp = mockBlueprints.find(
      (b) =>
        b.author.toLowerCase() === author?.trim().toLowerCase() &&
        b.name.toLowerCase() === name?.trim().toLowerCase(),
    )
    if (!bp) {
      throw new Error(`Blueprint "${name}" del autor "${author}" no encontrado.`)
    }
    return structuredClone(bp)
  },
  create: async (blueprint) => {
    mockBlueprints.push(structuredClone(blueprint))
    return structuredClone(blueprint)
  },
}

export default apimock
