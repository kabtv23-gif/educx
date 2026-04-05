// api/send-email.js — Vercel Serverless Function
// Place ce fichier dans le dossier /api/ de ton projet Vercel

export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email manquant' });
  }

  // Clé API Resend depuis les variables d'environnement Vercel
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Clé API Resend non configurée' });
  }

  // Choisir le template selon le type
  let subject, html;

  if (type === 'welcome') {
    subject = `🎉 Bienvenue sur EDUCX, ${name} !`;
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; background: #07080f; color: #e8eaf6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #0f1120; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          .header { background: linear-gradient(135deg, #5b6ef8, #5bf8c4); padding: 40px; text-align: center; }
          .header h1 { color: #fff; font-size: 2rem; margin: 0; letter-spacing: -1px; }
          .body { padding: 40px; }
          .body h2 { color: #e8eaf6; font-size: 1.4rem; margin-bottom: 16px; }
          .body p { color: #9ca3af; line-height: 1.7; margin-bottom: 16px; }
          .btn { display: inline-block; background: #5b6ef8; color: #fff; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; margin-top: 8px; }
          .footer { text-align: center; padding: 24px; color: #4b5563; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EDUCX ⚡</h1>
          </div>
          <div class="body">
            <h2>Bienvenue ${name} ! 🎉</h2>
            <p>Ton compte EDUCX est prêt. Tu peux maintenant accéder à tous les cours de maths, physique et chimie.</p>
            <p>🧪 Explore les leçons interactives<br>📊 Suis ta progression<br>🏆 Défie tes amis en duel</p>
            <a href="https://educx-coral.vercel.app" class="btn">Commencer maintenant →</a>
          </div>
          <div class="footer">
            © 2025 EDUCX — La Science à ta portée<br>
            Tu reçois cet email car tu viens de créer un compte.
          </div>
        </div>
      </body>
      </html>
    `;
  } else if (type === 'verification') {
    const { code } = req.body;
    subject = `🔐 Vérifie ton email EDUCX`;
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #07080f; color: #e8eaf6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #0f1120; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          .header { background: linear-gradient(135deg, #5b6ef8, #f85b9e); padding: 40px; text-align: center; }
          .header h1 { color: #fff; font-size: 2rem; margin: 0; }
          .body { padding: 40px; text-align: center; }
          .code { font-size: 3rem; font-weight: 800; letter-spacing: 12px; color: #5bf8c4; background: rgba(91,248,196,0.1); padding: 24px; border-radius: 12px; margin: 24px 0; display: inline-block; }
          .body p { color: #9ca3af; line-height: 1.7; }
          .footer { text-align: center; padding: 24px; color: #4b5563; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>EDUCX ⚡</h1></div>
          <div class="body">
            <p>Bonjour ${name},</p>
            <p>Voici ton code de vérification :</p>
            <div class="code">${code || '------'}</div>
            <p>Ce code expire dans <strong>10 minutes</strong>.</p>
            <p style="color:#6b7280;font-size:0.85rem">Si tu n'as pas créé de compte, ignore cet email.</p>
          </div>
          <div class="footer">© 2025 EDUCX — La Science à ta portée</div>
        </div>
      </body>
      </html>
    `;
  } else if (type === 'notification') {
    const { message } = req.body;
    subject = `🔔 Notification EDUCX`;
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #07080f; color: #e8eaf6; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #0f1120; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
          .header { background: #171929; padding: 32px 40px; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .header h1 { color: #5b6ef8; font-size: 1.4rem; margin: 0; }
          .body { padding: 40px; }
          .body p { color: #9ca3af; line-height: 1.7; }
          .message { background: rgba(91,110,248,0.1); border-left: 3px solid #5b6ef8; padding: 16px 20px; border-radius: 8px; color: #e8eaf6; margin: 16px 0; }
          .footer { text-align: center; padding: 24px; color: #4b5563; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>EDUCX ⚡ Notification</h1></div>
          <div class="body">
            <p>Bonjour ${name},</p>
            <div class="message">${message || 'Tu as une nouvelle notification sur EDUCX.'}</div>
            <p>Connecte-toi pour voir les détails.</p>
          </div>
          <div class="footer">© 2025 EDUCX — La Science à ta portée</div>
        </div>
      </body>
      </html>
    `;
  } else {
    return res.status(400).json({ error: 'Type email invalide. Utilise: welcome, verification, notification' });
  }

  // Envoyer via Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EDUCX <onboarding@resend.dev>',
        to: [email],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur Resend:', data);
      return res.status(500).json({ error: data.message || 'Erreur envoi email' });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error('Erreur serveur:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
