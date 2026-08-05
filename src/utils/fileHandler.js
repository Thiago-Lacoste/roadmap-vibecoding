function downloadRoadmap(roadmap) {
  const safeName = roadmap.title.trim().replace(/[\\/:*?"<>|]+/g, '-') || 'roadmap'
  const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${safeName}.roadmap`
  link.click()
  URL.revokeObjectURL(url)
}

function uploadRoadmap(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!data.title || !Array.isArray(data.phases)) {
          throw new Error('Formato inválido')
        }
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

export { downloadRoadmap, uploadRoadmap }
