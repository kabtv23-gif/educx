export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { prompt, image, mimeType } = req.body;
    const KEY = process.env.OPENROUTER_API_KEY;

    const messages = [{
      role: 'user',
      content: image
        ? [{ type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } }, { type: 'text', text: prompt }]
        : prompt
    }];

    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`,
        'HTTP-Referer': 'https://educx-coral.vercel.app',
        'X-Title': 'EDUCX'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-27b-it:free',
        messages,
        max_tokens: 1200,
        temperature: 0.7
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'Erreur' });
    res.status(200).json({ text: data.choices?.[0]?.message?.content || '' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
