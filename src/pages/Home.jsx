import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoadmaps } from '../context/RoadmapContext'
import { uploadRoadmap, downloadRoadmap } from '../utils/fileHandler'

function calcularProgreso(roadmap) {
  const phases = roadmap.phases
  if (!phases || phases.length === 0) return { total: 0, done: 0 }
  const totalItems = phases.reduce((acc, p) => acc + (p.items?.length ?? 0), 0)
  const doneItems = phases.reduce((acc, p) => acc + (p.items?.filter(i => i.done).length ?? 0), 0)
  return { total: totalItems, done: doneItems }
}

export default function Home() {
  const { roadmaps, createRoadmap, deleteRoadmap, updateRoadmap, importRoadmap } = useRoadmaps()
  const [titulo, setTitulo] = useState('')
  const [creando, setCreando] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const navigate = useNavigate()
  const fileRef = useRef()

  function handleCrear() {
    if (!titulo.trim()) return
    const id = createRoadmap(titulo.trim())
    setTitulo('')
    setCreando(false)
    navigate(`/editor/${id}`)
  }

  async function handleImportar(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const data = await uploadRoadmap(file)
      const id = importRoadmap(data)
      navigate(`/editor/${id}`)
    } catch {
      alert('Archivo inválido. Asegúrate de subir un archivo .roadmap')
    } finally {
      e.target.value = ''
    }
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p className="mono gris" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '8px' }}>
          ROADMAP BUILDER
        </p>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '700' }}>
          Mis <span className="rojo">Roadmaps</span>
        </h1>
        {roadmaps.length > 0 && (
          <p className="mono gris" style={{ fontSize: '0.75rem', marginTop: '8px' }}>
            {roadmaps.length} roadmap{roadmaps.length !== 1 ? 's' : ''} guardado{roadmaps.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', justifyContent: 'center' }}>
        <button className="btn-japones" onClick={() => setCreando(!creando)}>
          <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
          Nuevo roadmap
        </button>
        <button className="btn-japones dorado" onClick={() => fileRef.current.click()}>
          <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
          Importar .roadmap
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".roadmap"
          style={{ display: 'none' }}
          onChange={handleImportar}
        />
      </div>

      {creando && (
        <div className="inline-panel">
          <input
            autoFocus
            type="text"
            placeholder="Nombre del roadmap..."
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCrear()}
            className="inline-panel-input"
          />
          <button className="btn-japones rojo" onClick={handleCrear}>Crear</button>
          <button className="btn-japones" onClick={() => setCreando(false)}>Cancelar</button>
        </div>
      )}

      {roadmaps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gris)' }}>
          <p className="mono" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            NO HAY ROADMAPS AÚN
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Crea uno nuevo o importa un archivo .roadmap
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {roadmaps.map(rm => {
            const { total, done } = calcularProgreso(rm)
            const porcentaje = total > 0 ? Math.round((done / total) * 100) : 0
            const editando = editandoId === rm.id

            return (
              <div key={rm.id} className="roadmap-card">
                {editando ? (
                  <RoadmapQuickEdit
                    roadmap={rm}
                    onSave={(changes) => { updateRoadmap(rm.id, changes); setEditandoId(null) }}
                    onCancel={() => setEditandoId(null)}
                  />
                ) : (
                  <>
                    <div className="card-fecha">
                      {new Date(rm.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                    </div>
                    <h2>{rm.title}</h2>
                    {rm.mantra && <p className="card-mantra">{rm.mantra}</p>}

                    {total > 0 && (
                      <div style={{ margin: '12px 0' }}>
                        <div style={{ height: '3px', background: 'var(--borde)', borderRadius: '2px', overflow: 'hidden', marginBottom: '5px' }}>
                          <div style={{
                            height: '100%', width: `${porcentaje}%`,
                            background: porcentaje === 100 ? 'var(--dorado)' : 'var(--rojo)',
                            transition: 'width 0.4s ease', borderRadius: '2px'
                          }} />
                        </div>
                        <p className="mono gris" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                          {done}/{total} COMPLETADO{done !== 1 ? 'S' : ''} · {porcentaje}%
                        </p>
                      </div>
                    )}

                    <p className="card-fases">
                      {rm.phases.length} FASE{rm.phases.length !== 1 ? 'S' : ''}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                      <button className="btn-japones" onClick={() => navigate(`/editor/${rm.id}`)}>
                        <i className="fas fa-eye" style={{ marginRight: '6px' }}></i>Ver
                      </button>
                      <button className="btn-japones" onClick={() => setEditandoId(rm.id)}>
                        <i className="fas fa-pen" style={{ marginRight: '6px' }}></i>Editar
                      </button>
                      <button className="btn-japones dorado" onClick={() => downloadRoadmap(rm)}>
                        <i className="fas fa-download" style={{ marginRight: '6px' }}></i>Descargar
                      </button>
                      <button className="btn-japones rojo" onClick={() => {
                        if (confirm(`¿Eliminar "${rm.title}"?`)) deleteRoadmap(rm.id)
                      }}>
                        <i className="fas fa-xmark" style={{ marginRight: '6px' }}></i>Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function RoadmapQuickEdit({ roadmap, onSave, onCancel }) {
  const [title, setTitle] = useState(roadmap.title)
  const [mantra, setMantra] = useState(roadmap.mantra)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="inline-panel-input"
        placeholder="Título del roadmap..."
      />
      <input
        value={mantra}
        onChange={e => setMantra(e.target.value)}
        className="inline-panel-input mono dorado"
        placeholder="Mantra o subtítulo..."
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn-japones rojo" onClick={() => onSave({ title: title.trim() || roadmap.title, mantra })}>
          <i className="fas fa-check" style={{ marginRight: '6px' }}></i>Guardar
        </button>
        <button className="btn-japones" onClick={onCancel}>
          <i className="fas fa-xmark" style={{ marginRight: '6px' }}></i>Cancelar
        </button>
      </div>
    </div>
  )
}
