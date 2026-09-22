import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBlueprint } from '../features/blueprints/blueprintsSlice.js'
import BlueprintForm from '../components/BlueprintForm.jsx'

export default function CreateBlueprintPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (payload) => {
    try {
      await dispatch(createBlueprint(payload)).unwrap()
      alert('Blueprint creado exitosamente')
      navigate('/')
    } catch (e) {
      alert('Error al crear: ' + e)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <BlueprintForm onSubmit={handleSubmit} />
    </div>
  )
}
