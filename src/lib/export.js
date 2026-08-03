function exportRoadmap(roadmap) {
  const { title, tags, content, createdAt, updatedAt } = roadmap
  return JSON.stringify({ title, tags, content, createdAt, updatedAt }, null, 2)
}

export { exportRoadmap }
