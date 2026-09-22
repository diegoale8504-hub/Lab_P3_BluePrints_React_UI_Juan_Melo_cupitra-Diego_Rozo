import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  updateBlueprint,
  deleteBlueprint,
  selectTop5Blueprints,
  addPointToCurrent,
  clearCurrentBlueprint
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status, error } = useSelector((s) => s.blueprints)
  const top5 = useSelector(selectTop5Blueprints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []
  const token = localStorage.getItem('token')

  const [newPoints, setNewPoints] = useState([])

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput) return
    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    setNewPoints([])
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  const handleSave = async () => {
    if (!current || newPoints.length === 0) {
      alert('No hay puntos nuevos para guardar')
      return
    }
    
    try {
      for (const pt of newPoints) {
        await dispatch(updateBlueprint({
          author: current.author,
          name: current.name,
          point: pt
        })).unwrap()
      }
      setNewPoints([])
      alert('Guardado con éxito')
      dispatch(fetchByAuthor(current.author))
    } catch (e) {
      alert('Error al guardar. Puede que la conexión haya fallado.')
    }
  }

  const handleAddPoint = (pt) => {
    dispatch(addPointToCurrent(pt))
    setNewPoints(prev => [...prev, pt])
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr 1.4fr', gap: 24 }}>
      <section className="grid" style={{ gap: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              placeholder="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <button className="btn primary" onClick={getBlueprints}>
              Get blueprints
            </button>
          </div>
        </div>

        {status === 'failed' && (
          <div style={{ padding: 12, background: '#450a0a', color: '#fca5a5', borderRadius: 8, border: '1px solid #7f1d1d' }}>
            <p style={{ margin: 0 }}><strong>Error:</strong> {error}</p>
            <button className="btn" style={{ marginTop: 8 }} onClick={() => getBlueprints()}>
              Reintentar
            </button>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>
          {status === 'loading' && <p>Cargando...</p>}
          {!items.length && status !== 'loading' && <p>Sin resultados.</p>}
          {!!items.length && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #334155' }}>Blueprint name</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #334155' }}>Points</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #334155' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((bp) => (
                    <tr key={bp.name}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>{bp.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #1f2937' }}>{bp.points?.length || 0}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #1f2937' }}>
                        <button className="btn" onClick={() => openBlueprint(bp)}>Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ marginTop: 12, fontWeight: 700 }}>Total user points: {totalPoints}</p>
        </div>
        
        {top5.length > 0 && (
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Top 5 Blueprints</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {top5.map(bp => (
                <li key={bp.author + bp.name}>{bp.name} ({bp.author}) - {bp.points?.length || 0} puntos</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Current blueprint: {current?.name || '—'}</h3>
        <BlueprintCanvas 
          points={current?.points || []} 
          onAddPoint={token && current ? handleAddPoint : undefined}
        />
        {current && token && (
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button className="btn primary" onClick={handleSave}>Guardar</button>
          </div>
        )}
      </section>
    </div>
  )
}
