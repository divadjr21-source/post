// /api/generate-content
// Recebe { theme } e devolve { caption, whatsapp } gerados pela IA.
// Usa o Gemini (Google) para gerar o texto — mesma chave já usada em enhance-image.js.
// A chave da API fica só aqui no servidor (variável de ambiente GOOGLE_API_KEY na Vercel).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { theme } = req.body || {};
  if (!theme || typeof theme !== 'string') {
    return res.status(400).json({ error: 'Tema não informado' });
  }

  const prompt = `Você é o redator de mídias sociais da RD Solutions, empresa de segurança eletrônica (CFTV, controle de acesso, alarmes, redes estruturadas).
Gere conteúdo persuasivo, profissional e claro em português do Brasil sobre o tema: "${theme}".
Responda SOMENTE em JSON válido, sem markdown, sem crases, sem texto antes ou depois, exatamente neste formato:
{"caption": "legenda para Instagram com hashtags relevantes ao final", "whatsapp": "mensagem curta e direta para iniciar conversa no WhatsApp, convidando o cliente a pedir um orçamento ou avaliação"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error (text):', errText);
      return res.status(502).json({ error: 'Falha ao gerar conteúdo' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json({
      caption: parsed.caption || '',
      whatsapp: parsed.whatsapp || '',
    });
  } catch (err) {
    console.error('generate-content error:', err);
    return res.status(500).json({ error: 'Erro interno ao gerar conteúdo' });
  }
}
