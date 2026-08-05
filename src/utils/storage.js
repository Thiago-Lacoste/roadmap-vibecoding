const STORAGE_KEY = 'roadmaps'
const MAX_TEXT_LENGTH = 10000

function toSafeString(value, fallback = '') {
  if (typeof value !== 'string') return fallback
  return value.slice(0, MAX_TEXT_LENGTH)
}

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null
  return {
    ...item,
    id: toSafeString(item.id, ''),
    text: toSafeString(item.text, ''),
    done: item.done === true
  }
}

function normalizePhase(phase) {
  if (!phase || typeof phase !== 'object') return null
  return {
    ...phase,
    id: toSafeString(phase.id, ''),
    title: toSafeString(phase.title, ''),
    time: toSafeString(phase.time, ''),
    items: Array.isArray(phase.items)
      ? phase.items.map(normalizeItem).filter(Boolean)
      : []
  }
}

function toSafeDateIso(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function normalizeRoadmap(roadmap) {
  if (!roadmap || typeof roadmap !== 'object') return null
  return {
    ...roadmap,
    title: toSafeString(roadmap.title, 'Mi Roadmap'),
    mantra: toSafeString(roadmap.mantra, ''),
    created_at: toSafeDateIso(roadmap.created_at),
    phases: Array.isArray(roadmap.phases)
      ? roadmap.phases.map(normalizePhase).filter(Boolean)
      : []
  }
}

function getRoadmaps() {
  let raw
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return []
  }

  if (!raw) return []

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) return []

  return parsed.map(normalizeRoadmap).filter(Boolean)
}

function saveRoadmaps(roadmaps) {
  const safeRoadmaps = Array.isArray(roadmaps) ? roadmaps.map(normalizeRoadmap).filter(Boolean) : []
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeRoadmaps))
}

export { getRoadmaps, saveRoadmaps, normalizeRoadmap }
