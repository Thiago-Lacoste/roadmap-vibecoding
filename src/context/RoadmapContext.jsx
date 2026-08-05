import { createContext, useContext, useState, useEffect } from 'react'
import { getRoadmaps, saveRoadmaps, normalizeRoadmap } from '../utils/storage'
import { v4 as uuidv4 } from 'uuid'

const RoadmapContext = createContext()

export function RoadmapProvider({ children }) {
  const [roadmaps, setRoadmaps] = useState(() => getRoadmaps())

  useEffect(() => {
    saveRoadmaps(roadmaps)
  }, [roadmaps])

  function createRoadmap(title) {
    const nuevo = {
      id: uuidv4(),
      title: title || 'Mi Roadmap',
      mantra: '',
      created_at: new Date().toISOString(),
      phases: []
    }
    setRoadmaps(prev => [...prev, nuevo])
    return nuevo.id
  }

  function updateRoadmap(id, changes) {
    setRoadmaps(prev =>
      prev.map(r => r.id === id ? { ...r, ...changes } : r)
    )
  }

  function deleteRoadmap(id) {
    setRoadmaps(prev => prev.filter(r => r.id !== id))
  }

  function importRoadmap(data) {
    const importado = normalizeRoadmap({ ...data, id: uuidv4() })
    setRoadmaps(prev => [...prev, importado])
    return importado.id
  }

  return (
    <RoadmapContext.Provider value={{
      roadmaps,
      createRoadmap,
      updateRoadmap,
      deleteRoadmap,
      importRoadmap
    }}>
      {children}
    </RoadmapContext.Provider>
  )
}

export function useRoadmaps() {
  return useContext(RoadmapContext)
}
