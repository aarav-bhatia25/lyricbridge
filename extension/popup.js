document.getElementById('apply').addEventListener('click', async () => {
    const lang = document.getElementById('lang').value;
    const statusEl = document.getElementById('status');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    if (!tab || !tab.url.includes('open.spotify.com')) {
      statusEl.textContent = 'Open Spotify first!';
      return;
    }
  
    chrome.tabs.sendMessage(tab.id, { type: 'SET_LANG', lang });
    statusEl.textContent = `Translating to ${lang}...`;
  });
  