import { useState } from 'react'
import RoadmapForm from './components/RoadmapForm'
import RoadmapList from './components/RoadmapList'
import SearchBar from './components/SearchBar'

function App() {
  const [query, setQuery] = useState('')
  const [editingRoadmap, setEditingRoadmap] = useState(null)

  return (
    <>
      <h1>Roadmap Builder</h1>
      <RoadmapForm
        editingRoadmap={editingRoadmap}
        onDoneEditing={() => setEditingRoadmap(null)}
      />
      <SearchBar value={query} onChange={setQuery} />
      <RoadmapList query={query} onEdit={setEditingRoadmap} />
    </>
  )
}

export default App
