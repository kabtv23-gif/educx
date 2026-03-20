export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { type, name, email } = req.body;
    const RESEND_KEY = process.env.RESEND_API_KEY;

    let subject, html;

    if (type === 'welcome') {
      subject = `🎓 Bienvenue sur EDUCX, ${name} !`;
      html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#07080f;color:#e8eaf6;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#5b6ef8,#5bf8c4);padding:40px;text-align:center">
            <h1 style="margin:0;font-size:2rem;color:#fff">EDUCX</h1>
            <p style="color:rgba(255,255,255,0.8);margin-top:8px">La science à ta portée</p>
          </div>
          <div style="padding:40px">
            <h2 style="color:#5bf8c4">Bienvenue ${name} ! 🎉</h2>
            <p style="color:#9ca3af;line-height:1.7">Ton compte EDUCX est créé avec succès !</p>
            <div style="background:#0f1120;border-radius:12px;padding:20px;margin:24px 0">
              <p style="margin:8px 0">✅ Accès aux cours de Maths, Physique et Chimie</p>
              <p style="margin:8px 0">✅ Tuteur IA personnel disponible 24h/24</p>
              <p style="margin:8px 0">✅ Quiz adaptatifs pour progresser</p>
              <p style="margin:8px 0">✅ Annales BAC avec corrigés</p>
            </div>
            <div style="text-align:center;margin-top:32px">
              <a href="https://educx-coral.vercel.app" style="background:linear-gradient(135deg,#5b6ef8,#7c3aed);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;display:inline-block">
                🚀 Commencer maintenant
              </a>
            </div>
          </div>
          <div style="padding:20px;text-align:center;color:#4b5563;font-size:0.8rem;border-top:1px solid #1f2937">
            EDUCX — educx-coral.vercel.app
          </div>
        </div>`;
    } else if (type === 'reminder') {
      subject = `⚡ ${name}, tes cours t'attendent sur EDUCX !`;
      html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#07080f;color:#e8eaf6;border-radius:16px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#f85b9e,#f8c25b);padding:40px;text-align:center">
            <h1 style="margin:0;font-size:2rem;color:#fff">EDUCX</h1>
          </div>
          <div style="padding:40px">
            <h2 style="color:#f8c25b">Hey ${name} ! 👋</h2>
            <p style="color:#9ca3af;line-height:1.7">Ça fait quelques jours qu'on ne t'a pas vu sur EDUCX...</p>
            <div style="text-align:center;margin-top:32px">
              <a href="https://educx-coral.vercel.app" style="background:linear-gradient(135deg,#f85b9e,#f8c25b);color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;display:inline-block">
                📚 Reprendre mes cours
              </a>
            </div>
          </div>
        </div>`;
    }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`
      },
      body: JSON.stringify({
        from: 'EDUCX <onboarding@resend.dev>',
        to: [email],
        subject,
        html
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message });
    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
