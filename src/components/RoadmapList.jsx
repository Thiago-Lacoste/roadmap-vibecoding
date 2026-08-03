import { useEffect, useState } from 'react'
import { exportRoadmap } from '../lib/export'
import { deleteRoadmap, getRoadmaps } from '../lib/storage'

function RoadmapList({ query, onEdit }) {
  const [roadmaps, setRoadmaps] = useState([])

  useEffect(() => {
    setRoadmaps(getRoadmaps())
  }, [])

  function handleDelete(id) {
    if (!window.confirm('¿Eliminar este roadmap?')) return
    deleteRoadmap(id)
    setRoadmaps(getRoadmaps())
  }

  function handleDownload(roadmap) {
    const safeName = roadmap.title.trim().replace(/[\\/:*?"<>|]+/g, '-') || 'roadmap'
    const blob = new Blob([exportRoadmap(roadmap)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${safeName}.roadmap`
    link.click()
    URL.revokeObjectURL(url)
  }

  const normalizedQuery = query.trim().toLowerCase()
  const visibleRoadmaps = normalizedQuery
    ? roadmaps.filter((roadmap) => {
        const matchesTitle = roadmap.title.toLowerCase().includes(normalizedQuery)
        const matchesTag = roadmap.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedQuery)
        )
        const matchesContent = roadmap.content.toLowerCase().includes(normalizedQuery)
        return matchesTitle || matchesTag || matchesContent
      })
    : roadmaps

  if (roadmaps.length === 0) {
    return <p>Todavía no creaste ningún roadmap. ¡Creá el primero arriba!</p>
  }

  if (visibleRoadmaps.length === 0) {
    return <p>No se encontraron roadmaps.</p>
  }

  return (
    <ul>
      {visibleRoadmaps.map((roadmap) => (
        <li key={roadmap.id}>
          <h3>{roadmap.title}</h3>
          <p>{new Date(roadmap.createdAt).toLocaleString()}</p>
          {roadmap.tags.length > 0 && (
            <div className="tag-list">
              {roadmap.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <button type="button" onClick={() => onEdit(roadmap)}>
            Editar
          </button>
          <button type="button" onClick={() => handleDownload(roadmap)}>
            Descargar
          </button>
          <button type="button" onClick={() => handleDelete(roadmap.id)}>
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}

export default RoadmapList
