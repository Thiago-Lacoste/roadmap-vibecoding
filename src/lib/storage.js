const STORAGE_KEY = 'roadmaps'

function getRoadmaps() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function persist(roadmaps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps))
}

function saveRoadmap({ title, content, tags = [] }) {
  const now = new Date().toISOString()
  const roadmap = {
    id: crypto.randomUUID(),
    title,
    content,
    tags,
    createdAt: now,
    updatedAt: now,
  }
  persist([...getRoadmaps(), roadmap])
  return roadmap
}

function updateRoadmap(id, changes) {
  const updated = getRoadmaps().map((roadmap) =>
    roadmap.id === id
      ? { ...roadmap, ...changes, updatedAt: new Date().toISOString() }
      : roadmap
  )
  persist(updated)
}

function deleteRoadmap(id) {
  persist(getRoadmaps().filter((roadmap) => roadmap.id !== id))
}

export { getRoadmaps, saveRoadmap, updateRoadmap, deleteRoadmap }
