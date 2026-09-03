const list = document.getElementById('songs');
const empty = document.getElementById('emptyState');
const search = document.getElementById('search');
const clearSearch = document.getElementById('clearSearch');
const resultCount = document.getElementById('resultCount');
const expandAll = document.getElementById('expandAll');

function normalize(value) {
  return value
    .toLocaleLowerCase('ru-RU')
    .replaceAll('ё', 'е')
    .replace(/[–—]/g, '-')
    .trim();
}

function render(query = '') {
  const q = normalize(query);
  const filtered = songs.filter(song =>
    !q || normalize(`${song.title} ${song.artist}`).includes(q)
  );

  resultCount.textContent = `${filtered.length} ${plural(filtered.length, ['песня', 'песни', 'песен'])}`;
  list.innerHTML = '';
  empty.hidden = filtered.length !== 0;

  filtered.forEach((song) => {
    const index = songs.indexOf(song) + 1;
    const row = document.createElement('article');
    row.className = 'song';

    const text = song.lyrics?.trim();
    const chorus = song.chorus?.trim();
    let lyricHtml = '';

    if (text || chorus) {
      const parts = [];
      if (chorus) parts.push(`<div class="chorus">${escapeHtml(chorus)}</div>`);
      if (text) parts.push(`<div>${escapeHtml(text)}</div>`);
      lyricHtml = parts.join('');
    } else {
      lyricHtml = '<div class="lyrics-note">Текст этой песни пока не добавлен. Откройте <code>songs.js</code> и вставьте ваш текст в поле <code>lyrics</code>.</div>';
    }

    row.innerHTML = `
      <button class="song-head" type="button" aria-expanded="false">
        <span class="song-num">${String(index).padStart(2,'0')}</span>
        <span>
          <div class="song-title">${escapeHtml(song.title)}</div>
          <div class="song-artist">${escapeHtml(song.artist)}</div>
        </span>
        <span class="song-status">${text || chorus ? 'текст' : 'добавить текст'}</span>
        <span class="chevron">⌄</span>
      </button>
      <div class="lyrics"><div class="lyrics-inner">${lyricHtml}</div></div>
    `;

    row.querySelector('.song-head').addEventListener('click', () => {
      const open = row.classList.toggle('open');
      row.querySelector('.song-head').setAttribute('aria-expanded', String(open));
    });

    list.appendChild(row);
  });
}

function plural(n, forms) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

search.addEventListener('input', () => render(search.value));
clearSearch.addEventListener('click', () => {
  search.value = '';
  search.focus();
  render('');
});

expandAll.addEventListener('click', () => {
  const rows = [...document.querySelectorAll('.song')];
  const shouldOpen = rows.some(row => !row.classList.contains('open'));
  rows.forEach(row => {
    row.classList.toggle('open', shouldOpen);
    row.querySelector('.song-head').setAttribute('aria-expanded', String(shouldOpen));
  });
  expandAll.textContent = shouldOpen ? 'Свернуть все' : 'Раскрыть все';
});

render();
