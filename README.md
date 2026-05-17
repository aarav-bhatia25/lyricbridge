# LyricBridge 🎵

> Real-time AI-powered lyric translation for Spotify — because music is universal, but language barriers aren't.

---

## The Problem

Spotify has lyrics for millions of songs. But if the song is in Spanish, Hindi, Arabic, or Japanese — you get nothing. No translation, no romanization, no context. You're left copy-pasting lines into Google Translate one by one, completely breaking the listening experience.

**Over 60% of Spotify's most-streamed songs are non-English.** Latin, Bollywood, K-pop, Afrobeats — massive global genres with hundreds of millions of listeners who understand zero words of what they're hearing.

---

## What LyricBridge Does

LyricBridge is a Chrome extension that injects real-time translations directly into Spotify's lyrics panel — inline, in sync with the music, with romanization so you can sing along too.

**Play a Bad Bunny song. Watch Spanish lyrics appear with their English meaning and pronunciation — right there, below each line, as the song plays.**

---

## Why LyricBridge Is Better Than Existing Solutions

Several extensions already attempt lyric translation. Every single one uses **Google Translate**. LyricBridge uses a **large language model (LLaMA 3.3 70B via Groq)**.

Here's why that matters:

| | Google Translate | LyricBridge (LLM) |
|---|---|---|
| Translates word-for-word | ✅ | ❌ (understands full context) |
| Understands slang & idioms | ❌ | ✅ |
| Reads the whole song for context | ❌ | ✅ |
| Preserves emotional tone | ❌ | ✅ |
| Romanization support | ❌ | ✅ |
| Culturally accurate | ❌ | ✅ |

**Example:** The Bad Bunny lyric *"Yo perreo sola"* translated word-for-word is "I twerk alone." LyricBridge translates it as "I dance on my own terms" — because it understands the defiance and attitude of the song, not just the dictionary meaning of each word.

Google Translate would give you neither of these. It sees words. LyricBridge sees meaning.

---

## How It Works

```
Spotify Web Player
      ↓  reads lyrics directly from the DOM — no paid API needed
Chrome Extension (content.js)
      ↓  sends lyrics + song title + artist to backend
Node.js Server (Express)
      ↓  builds a context-aware prompt with the full song
Groq API — LLaMA 3.3 70B
      ↓  returns JSON: translation + romanization per line
Chrome Extension
      ↓  injects translations inline below each lyric
You 🎵
```

**Session caching:** once a song is translated, every replay is instant — no API call needed again.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Browser Extension | Vanilla JS, Manifest V3 | No framework overhead |
| Backend | Node.js + Express | Lightweight, ~60 lines total |
| AI Translation | Groq + LLaMA 3.3 70B | Free, fast, contextually aware |
| Lyrics Source | Spotify DOM scraping | No paid lyrics API needed |
| Caching | In-memory Map | Zero setup, instant replays |
| Deployment | Vercel | Free, zero config |

**Total cost to run: $0**

---

## Features

- ✅ Real-time inline translation on Spotify's lyrics panel
- ✅ Romanization for Spanish, Hindi, Punjabi, Korean, Japanese, Arabic and more
- ✅ Session-level caching for instant replays
- ✅ Language switcher popup (English, Hindi, Spanish, French, and more)
- ✅ Loading indicator while translating
- ✅ Works on any song that has Spotify lyrics

---

## Installation (Run Locally)

### Prerequisites
- Node.js v18+
- Chrome browser
- Free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/aarav-bhatia25/LyricBridge-.git
cd lyricbridge
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```
GROQ_API_KEY=your_groq_key_here
PORT=3000
```

### 3. Start the server
```bash
node server.js
```

### 4. Load the Chrome extension
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked** → select the `extension/` folder
4. Pin LyricBridge to your Chrome toolbar

### 5. Use it
1. Open [open.spotify.com](https://open.spotify.com)
2. Play any non-English song
3. Open the lyrics panel (microphone icon, bottom right)
4. Watch translations appear ✨

---

## Project Structure

```
lyricbridge/
  server/
    server.js        ← Express server, calls Groq API (~60 lines)
    package.json
  extension/
    manifest.json    ← Chrome extension config
    content.js       ← Runs inside Spotify, reads & injects lyrics
    popup.html       ← Language selector UI
    popup.js         ← Popup logic
    icon.png
  README.md
  .gitignore
```

---

## Built By

Aarav Bhatia — [github.com/aarav-bhatia25](https://github.com/aarav-bhatia25)

---

