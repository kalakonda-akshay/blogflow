export const CATEGORIES = ['All','Tech','Lifestyle','Travel','Food','Health','Business','Other'];

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const fmtDateShort = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const errMsg = (e) =>
  e?.response?.data?.message || e?.message || 'Something went wrong';

export function renderContent(text) {
  if (!text) return '';
  let html = text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/```[\w]*\n([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.split('\n\n').map(block => {
    if (block.startsWith('<h') || block.startsWith('<pre') || block.startsWith('<blockquote') || block.startsWith('<li') || block.trim() === '') return block;
    if (block.startsWith('<li')) return `<ul>${block}</ul>`;
    return `<p>${block}</p>`;
  }).join('');
  return html;
}
