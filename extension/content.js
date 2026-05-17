let currentTrackId = null;
let targetLang = 'English';

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_LANG') {
    targetLang = msg.lang;
    currentTrackId = null;
    checkForNewSong();
  }
});

const observer = new MutationObserver(() => checkForNewSong());
observer.observe(document.body, { childList: true, subtree: true });

function checkForNewSong() {
  const titleEl = document.querySelector('[data-testid="context-item-info-title"]');
  const artistEl = document.querySelector('[data-testid="context-item-info-subtitles"]');
  if (!titleEl) return;

  const trackName = titleEl.innerText.trim();
  const artist = artistEl ? artistEl.innerText.trim() : 'Unknown';
  const trackId = `${trackName}-${artist}-${targetLang}`;

  if (trackId !== currentTrackId) {
    currentTrackId = trackId;
    translateCurrentSong(trackName, artist);
  }
}

async function translateCurrentSong(trackName, artist) {
  await waitForElement('[data-testid="lyrics-line"]', 5000);

  const lyricEls = document.querySelectorAll('[data-testid="lyrics-line"]');
  if (!lyricEls || lyricEls.length === 0) {
    console.log('LyricBridge: No lyrics available for this song.');
    return;
  }

  const lines = [...lyricEls]
    .map(el => el.innerText.trim())
    .filter(t => t.length > 0);

  if (lines.length === 0) return;

  showLoadingIndicator();

  try {
    const res = await fetch('https://your-project-name.vercel.app/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackId: currentTrackId,
        trackName, artist, lines, targetLang
      })
    });
    const data = await res.json();
    injectTranslations(data.translated);
  } catch (e) {
    console.error('LyricBridge: Could not reach local server.', e);
    console.error('Make sure node server.js is running in your terminal.');
    clearLoadingIndicators();
  }
}

function showLoadingIndicator() {
  clearLoadingIndicators();
  const lyricEls = document.querySelectorAll('[data-testid="lyrics-line"]');
  lyricEls.forEach((el, i) => {
    if (i > 2) return;
    const loader = document.createElement('div');
    loader.className = 'lb-loader';
    loader.style.cssText = 'font-size:11px;color:#5B4FCC;font-style:italic;margin-top:2px;';
    loader.textContent = 'Translating...';
    el.appendChild(loader);
  });
}

function clearLoadingIndicators() {
  document.querySelectorAll('.lb-loader').forEach(el => el.remove());
}

function injectTranslations(translations) {
  clearLoadingIndicators();
  document.querySelectorAll('.lb-translation').forEach(el => el.remove());

  const lyricEls = document.querySelectorAll('[data-testid="lyrics-line"]');
  lyricEls.forEach((el, i) => {
    if (!translations[i]) return;
    const div = document.createElement('div');
    div.className = 'lb-translation';
    div.style.cssText = `
      font-size: 13px;
      color: #a8a8d8;
      margin-top: 3px;
      padding: 2px 0 2px 8px;
      border-left: 2px solid #5B4FCC;
      font-style: italic;
      line-height: 1.4;
    `;
    div.innerHTML = `
      <span style="color:#ccc;">${translations[i].translation}</span>
      <span style="color:#777;font-size:11px;"> &nbsp;(${translations[i].romanization})</span>
    `;
    el.appendChild(div);
  });
}

function waitForElement(selector, timeout) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        resolve();
      }
    }, 300);
    setTimeout(() => { clearInterval(interval); resolve(); }, timeout);
  });
}