require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const cache = new Map();

app.post('/translate', async (req, res) => {
  const { trackId, trackName, artist, lines, targetLang } = req.body;

  const cacheKey = `${trackId}-${targetLang}`;
  if (cache.has(cacheKey)) {
    return res.json({ translated: cache.get(cacheKey), cached: true });
  }
  const prompt = `You are translating song lyrics.
Song: "${trackName}" by ${artist}.
Translate each line to ${targetLang}.
Also provide romanization (pronunciation in Latin letters) for each line.

Lines:
${lines.map((l, i) => `${i + 1}. ${l}`).join('\n')}

Return ONLY a valid JSON array, no explanation, no markdown:
Make sure you capture the true meaning of the song;
[{"original": "...", "translation": "...", "romanization": "..."}]`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    console.log('Groq response:', JSON.stringify(data));

    const text = data.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const translated = JSON.parse(cleaned);

    cache.set(cacheKey, translated);
    res.json({ translated, cached: false });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT, () => {
  console.log(`LyricBridge server running on port ${process.env.PORT}`);
});
