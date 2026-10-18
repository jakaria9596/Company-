function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(str) {
  return escapeHtml(str)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>')
    .replace(/\[([^\]]+)\]\((\/[^\s)]*)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function formatContent(raw) {
  if (!raw) return '';
  const blocks = raw.split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('## ')) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith('### ')) return `<h3>${inline(trimmed.slice(4))}</h3>`;

      const lines = trimmed.split('\n');
      if (lines.every((l) => l.startsWith('- '))) {
        return `<ul class="list-disc pl-5 space-y-1">${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
      }
      if (lines.every((l) => /^\d+\.\s/.test(l))) {
        return `<ol class="list-decimal pl-5 space-y-1">${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s/, ''))}</li>`).join('')}</ol>`;
      }
      if (lines.every((l) => l.startsWith('> '))) {
        return `<blockquote class="border-l-4 border-line pl-4 text-ink-soft">${lines.map((l) => inline(l.slice(2))).join('<br/>')}</blockquote>`;
      }
      return `<p>${lines.map(inline).join('<br/>')}</p>`;
    })
    .join('\n');
}
