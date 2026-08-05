import { useState } from 'react'
import { parseMarkdown } from '../lib/markdown'

export default function EditableField({
  value,
  onSave,
  placeholder = '+ Agregar...',
  as: Component = 'span',
  className = '',
  displayStyle = {},
  inputStyle = {},
  renderMarkdown = false
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function startEdit() {
    setDraft(value)
    setEditing(true)
  }

  function handleSave() {
    onSave(draft)
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
  }

  if (editing) {
    return (
      <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', width: '100%' }}>
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          style={{
            flex: 1, fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit',
            background: 'transparent', border: 'none', borderBottom: '1px solid var(--rojo)',
            outline: 'none', color: 'var(--tinta)', ...inputStyle
          }}
        />
        <button className="btn-icon guardar" title="Guardar" onClick={handleSave}>
          <i className="fas fa-check"></i>
        </button>
        <button className="btn-icon cancelar" title="Cancelar" onClick={handleCancel}>
          <i className="fas fa-xmark"></i>
        </button>
      </span>
    )
  }

  return (
    <Component
      className={className}
      style={{ cursor: 'pointer', ...displayStyle }}
      onClick={startEdit}
      title="Clic para editar"
    >
      {renderMarkdown && value
        ? <span dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }} />
        : (value || placeholder)}
    </Component>
  )
}
