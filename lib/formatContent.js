function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function formatContent(raw) {
  if (!raw) return '';
  const blocks = raw.split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('## ')) {
        return `<h2>${inline(trimmed.slice(3))}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3>${inline(trimmed.slice(4))}</h3>`;
      }
      const withBreaks = trimmed.split('\n').map(inline).join('<br/>');
      return `<p>${withBreaks}</p>`;
    })
    .join('\n');
}
