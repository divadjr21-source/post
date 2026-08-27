// /api/enhance-image
// Recebe { image (base64), mimeType, theme, adjust, brand, aiRender } e devolve { image, mimeType } tratados.
// Usa o Gemini 2.5 Flash Image (Nano Banana) para editar a foto mantendo o conteúdo original.
// Chave da API fica só aqui no servidor (variável de ambiente GOOGLE_API_KEY na Vercel).

export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { image, mimeType, theme, adjust, brand, aiRender } = req.body || {};
  if (!image || !mimeType) {
    return res.status(400).json({ error: 'Imagem não informada' });
  }

  // Monta as instruções conforme o que o usuário marcou.
  const instructions = [];
  if (adjust) instructions.push('Melhore cor, contraste, nitidez e iluminação da foto, mantendo um resultado natural e realista.');
  if (brand) instructions.push('Adicione uma identidade visual discreta e profissional de marca de segurança eletrônica: uma faixa/rodapé sutil com boa legibilidade para o nome "RD Solutions", em tons de azul e laranja, sem cobrir o assunto principal da foto.');
  if (aiRender) instructions.push(`Dê um acabamento premium e elaborado à imagem, coerente com o tema "${theme || 'segurança eletrônica'}", como se fosse uma peça publicitária profissional, mas preservando fielmente o conteúdo original da foto (não invente elementos que não existem na imagem).`);

  if (instructions.length === 0) {
    // Nada marcado: devolve a imagem original sem chamar a IA.
    return res.status(200).json({ image, mimeType });
  }

  const prompt = `Edite esta foto para uso em post de rede social de uma empresa de segurança eletrônica. Instruções: ${instructions.join(' ')}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: image } },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'Falha ao tratar imagem' });
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inline_data || p.inlineData);
    const inline = imagePart?.inline_data || imagePart?.inlineData;

    if (!inline) {
      console.error('Gemini response sem imagem:', JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ error: 'IA não retornou imagem' });
    }

    return res.status(200).json({
      image: inline.data,
      mimeType: inline.mime_type || inline.mimeType || 'image/png',
    });
  } catch (err) {
    console.error('enhance-image error:', err);
    return res.status(500).json({ error: 'Erro interno ao tratar imagem' });
  }
}
