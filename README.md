# RD Solutions — Gerador de Post

App simples, **sem banco de dados e sem login**. Você digita o tema, sobe a foto (e opcionalmente um vídeo),
a IA gera a legenda do Instagram, a mensagem do WhatsApp e trata a imagem. Você copia o texto e baixa a
imagem/vídeo prontos para postar manualmente.

## Estrutura

```
rdpost/
├── index.html              → página (Tailwind + React via CDN, sem build)
├── app.jsx                 → toda a lógica da interface
├── api/
│   ├── generate-content.js → função serverless: gera legenda + mensagem (Anthropic API)
│   └── enhance-image.js    → função serverless: trata a imagem (Google Gemini API)
└── README.md                → este arquivo
```

Nenhum banco de dados é usado. As únicas peças de "servidor" são as duas funções em `/api`,
que existem só para esconder as chaves de API (elas não podem ficar expostas no navegador).

## 1. Deploy na Vercel

1. Crie uma conta gratuita em https://vercel.com (pode entrar com GitHub)
2. Suba esta pasta (`rdpost/`) para um repositório no GitHub
3. Na Vercel: **Add New → Project** → selecione o repositório → **Deploy**
4. A Vercel detecta as funções em `/api` automaticamente — não precisa configurar nada de build

## 2. Configurar as chaves de API (variáveis de ambiente)

No painel do projeto na Vercel: **Settings → Environment Variables**, adicione:

| Nome | Onde conseguir | Para quê |
|---|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com (Settings → API Keys) | Gerar legenda e mensagem de WhatsApp |
| `GOOGLE_API_KEY` | https://aistudio.google.com/apikey (Google AI Studio, gratuito) | Tratar/editar a imagem (Gemini) |

Depois de adicionar, faça um novo deploy (Vercel → Deployments → botão "Redeploy") para as variáveis
entrarem em vigor.

**Custo:** ambas cobram por uso (não é assinatura). Para o volume de um post por dia, o custo mensal é
tipicamente baixo (poucos dólares ou menos). Você pode acompanhar o consumo em cada painel.

## 3. Configurar o Cloudinary (só se for usar a parte de vídeo)

A edição de imagem roda pela função serverless, mas **vídeo é grande demais para passar pela função da
Vercel** (ela tem limite de tamanho de requisição). Por isso, o vídeo vai direto do navegador para o
Cloudinary, que já devolve o vídeo cortado no formato 9:16 com uma marca de texto.

1. Crie uma conta gratuita em https://cloudinary.com (não pede cartão)
2. No painel, copie o **Cloud Name** (aparece no topo do Dashboard)
3. Vá em **Settings → Upload → Upload presets → Add upload preset**
   - Marque **Signing Mode: Unsigned**
   - Salve e copie o **nome do preset**
4. No arquivo `index.html`, adicione estas duas linhas dentro de uma tag `<script>` antes do
   `<script type="text/babel" src="app.jsx">`:

```html
<script>
  window.CLOUDINARY_CLOUD_NAME = "seu-cloud-name-aqui";
  window.CLOUDINARY_UPLOAD_PRESET = "seu-preset-aqui";
</script>
```

Se você não for usar vídeo por enquanto, pode simplesmente ignorar esta seção — o resto do app
(legenda, mensagem, imagem) funciona normalmente sem isso.

## 4. Usando o app

1. Abra a URL que a Vercel te deu (algo como `seu-projeto.vercel.app`)
2. Digite o tema do post
3. Suba a foto e marque as opções de "Deixar premium" desejadas
4. Clique em **Gerar post com IA**
5. Copie a legenda e a mensagem, baixe a imagem
6. Poste manualmente no Instagram e no WhatsApp

## Sobre customização da marca

Os textos de marca ("RD Solutions", cores azul/laranja) estão hardcoded em `api/enhance-image.js`
(instrução de prompt) e em `app.jsx` (transformação do Cloudinary). Para trocar nome da empresa, cores
ou tom de voz, edite essas duas partes.
