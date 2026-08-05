import DOMPurify from 'dompurify'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseMarkdown(text) {
  if (!text) return ''

  let html = escapeHtml(text)

  const checkboxMatch = html.match(/^-\s*\[([ xX])\]\s*(.*)$/)
  if (checkboxMatch) {
    const checked = checkboxMatch[1].toLowerCase() === 'x'
    const label = checkboxMatch[2]
    html = `<span class="md-checkbox"><i class="fa-regular ${checked ? 'fa-square-check' : 'fa-square'}"></i> ${label}</span>`
  } else {
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>')
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'i', 's'],
    ALLOWED_ATTR: ['class']
  })
}

export { parseMarkdown }
