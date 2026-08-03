import { useEffect, useState } from 'react'
import { saveRoadmap, updateRoadmap } from '../lib/storage'

function RoadmapForm({ editingRoadmap, onDoneEditing }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (!editingRoadmap) return
    setTitle(editingRoadmap.title)
    setContent(editingRoadmap.content)
    setTagsInput(editingRoadmap.tags.join(', '))
  }, [editingRoadmap])

  function handleSubmit(event) {
    event.preventDefault()

    const tags = [...new Set(
      tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    )]

    if (editingRoadmap) {
      updateRoadmap(editingRoadmap.id, { title, content, tags })
    } else {
      saveRoadmap({ title, content, tags })
    }

    setTitle('')
    setContent('')
    setTagsInput('')
    onDoneEditing()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content">Contenido</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="tags">Etiquetas (separadas por coma)</label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
        />
      </div>
      <button type="submit">{editingRoadmap ? 'Guardar cambios' : 'Crear'}</button>
    </form>
  )
}

export default RoadmapForm
