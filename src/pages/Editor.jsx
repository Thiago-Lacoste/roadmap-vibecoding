import { useParams, useNavigate } from 'react-router-dom'
import { useRoadmaps } from '../context/RoadmapContext'
import { downloadRoadmap } from '../utils/fileHandler'
import EditableField from '../components/EditableField'
import { v4 as uuidv4 } from 'uuid'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { roadmaps, updateRoadmap } = useRoadmaps()
  const roadmap = roadmaps.find(r => r.id === id)

  if (!roadmap) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p className="mono gris">Roadmap no encontrado.</p>
        <button className="btn-japones" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
          Volver
        </button>
      </div>
    )
  }

  function addPhase() {
    const nueva = {
      id: uuidv4(), title: 'Nueva fase', time: '',
      order: roadmap.phases.length + 1, open: true, items: []
    }
    updateRoadmap(id, { phases: [...roadmap.phases, nueva] })
  }

  function updatePhase(phaseId, changes) {
    updateRoadmap(id, {
      phases: roadmap.phases.map(p => p.id === phaseId ? { ...p, ...changes } : p)
    })
  }

  function deletePhase(phaseId) {
    updateRoadmap(id, { phases: roadmap.phases.filter(p => p.id !== phaseId) })
  }

  function togglePhase(phaseId) {
    updatePhase(phaseId, { open: !roadmap.phases.find(p => p.id === phaseId).open })
  }

  function addItem(phaseId) {
    const phase = roadmap.phases.find(p => p.id === phaseId)
    updatePhase(phaseId, { items: [...phase.items, { id: uuidv4(), text: 'Nuevo elemento', done: false }] })
  }

  function updateItem(phaseId, itemId, changes) {
    const phase = roadmap.phases.find(p => p.id === phaseId)
    updatePhase(phaseId, {
      items: phase.items.map(i => i.id === itemId ? { ...i, ...changes } : i)
    })
  }

  function deleteItem(phaseId, itemId) {
    const phase = roadmap.phases.find(p => p.id === phaseId)
    updatePhase(phaseId, { items: phase.items.filter(i => i.id !== itemId) })
  }

  function progreso(phase) {
    if (phase.items.length === 0) return null
    const done = phase.items.filter(i => i.done).length
    return `${done}/${phase.items.length}`
  }

  return (
    <div>
      <div className="editor-topbar">
        <button className="btn-japones" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
          Volver
        </button>
        <span className="mono gris" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
          ROADMAP BUILDER
        </span>
        <button className="btn-japones dorado" onClick={() => downloadRoadmap(roadmap)}>
          <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
          Descargar .roadmap
        </button>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 80px' }}>

        <div className="editor-header">
          <span className="kanji-bg">道</span>
          <p className="subtitulo-jp">～ MI ROADMAP ～</p>

          <h1>
            <EditableField
              as="span"
              value={roadmap.title}
              onSave={(val) => updateRoadmap(id, { title: val.trim() || roadmap.title })}
              displayStyle={{ fontSize: '2.8rem', fontFamily: 'var(--font-serif)', fontWeight: '700' }}
              inputStyle={{ fontSize: '2.8rem', fontFamily: 'var(--font-serif)', fontWeight: '700', textAlign: 'center' }}
              className="rojo"
            />
          </h1>

          <p className="mono dorado" style={{ fontSize: '0.8rem', marginTop: '6px', letterSpacing: '0.1em' }}>
            <EditableField
              value={roadmap.mantra}
              onSave={(val) => updateRoadmap(id, { mantra: val })}
              placeholder="+ Agregar subtítulo"
              displayStyle={{ fontSize: '0.8rem' }}
              inputStyle={{ fontSize: '0.8rem', textAlign: 'center' }}
            />
          </p>

          <p className="autor-line" style={{ marginTop: '12px' }}>
            Lizukh · {new Date(roadmap.created_at).toLocaleDateString('es', { year: 'numeric', month: 'long' })}
          </p>

          <div className="sello" title="Roadmap activo">
            <i className="fas fa-pen-nib"></i>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roadmap.phases.map((phase, idx) => (
            <PhaseBlock
              key={phase.id}
              phase={phase}
              index={idx}
              onToggle={() => togglePhase(phase.id)}
              onUpdatePhase={(changes) => updatePhase(phase.id, changes)}
              onDeletePhase={() => { if (confirm(`¿Eliminar la fase "${phase.title}"?`)) deletePhase(phase.id) }}
              onAddItem={() => addItem(phase.id)}
              onUpdateItem={(itemId, changes) => updateItem(phase.id, itemId, changes)}
              onDeleteItem={(itemId) => deleteItem(phase.id, itemId)}
              progreso={progreso(phase)}
            />
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn-japones rojo" onClick={addPhase}>
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
            Agregar fase
          </button>
        </div>

        {roadmap.mantra && (
          <div className="mantra-footer">
            <p className="mantra-jp">継続は力なり</p>
            <p className="mantra-texto">{roadmap.mantra} — LIZUKH</p>
          </div>
        )}

      </div>
    </div>
  )
}

function PhaseBlock({ phase, index, onToggle, onUpdatePhase, onDeletePhase, onAddItem, onUpdateItem, onDeleteItem, progreso }) {
  return (
    <div className="phase-block">
      <div className="phase-header" onClick={onToggle}>
        <span className="phase-number">FASE {String(index + 1).padStart(2, '0')}</span>

        <div style={{ flex: 1 }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
            <EditableField
              value={phase.title}
              onSave={(val) => onUpdatePhase({ title: val.trim() || phase.title })}
              displayStyle={{ fontSize: '1.2rem', fontWeight: '700' }}
              inputStyle={{ fontSize: '1.2rem', fontWeight: '700' }}
            />
          </h3>
          <p className="mono dorado" style={{ fontSize: '0.7rem', margin: '4px 0 0', letterSpacing: '0.08em' }}>
            <EditableField
              value={phase.time}
              onSave={(val) => onUpdatePhase({ time: val })}
              placeholder="+ Período de tiempo"
              displayStyle={{ fontSize: '0.7rem' }}
              inputStyle={{ fontSize: '0.7rem' }}
            />
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {progreso && (
            <span className="mono gris" style={{ fontSize: '0.7rem' }}>{progreso}</span>
          )}
          <button
            onClick={e => { e.stopPropagation(); onDeletePhase() }}
            className="btn-icon"
          >
            <i className="fas fa-xmark"></i>
          </button>
          <i
            className={`fas ${phase.open ? 'fa-chevron-up' : 'fa-chevron-down'}`}
            style={{ color: 'var(--gris)', fontSize: '0.85rem' }}
          ></i>
        </div>
      </div>

      {phase.open && (
        <div className="phase-content">
          {phase.items.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={() => onUpdateItem(item.id, { done: !item.done })}
              onUpdateText={(text) => onUpdateItem(item.id, { text })}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
          <button
            className="btn-japones"
            style={{ fontSize: '0.7rem', padding: '6px 14px', marginTop: '12px' }}
            onClick={onAddItem}
          >
            <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>
            Elemento
          </button>
        </div>
      )}
    </div>
  )
}

function ItemRow({ item, onToggle, onUpdateText, onDelete }) {
  return (
    <div className={`roadmap-item ${item.done ? 'done' : ''}`}>
      <input type="checkbox" checked={item.done} onChange={onToggle} />
      <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        <EditableField
          value={item.text}
          onSave={(val) => onUpdateText(val.trim() || item.text)}
          renderMarkdown
          displayStyle={{ fontSize: '0.9rem' }}
          inputStyle={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}
        />
      </div>
      <button onClick={onDelete} className="btn-icon">
        <i className="fas fa-xmark"></i>
      </button>
    </div>
  )
}
