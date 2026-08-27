/**
 * RD Solutions — Gerador de Post
 * Funciona 100% no navegador: sem backend, sem banco de dados, sem login.
 * Gera legenda (Instagram) + mensagem (WhatsApp) e trata imagem no canvas.
 * O usuário copia o texto e baixa a imagem para postar manualmente.
 */
const { useState, useRef } = React;

// ===== Ícones inline =====
const Icon = {
  Sparkles: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>),
  Upload: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
  Copy: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>),
  Download: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Instagram: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>),
  WhatsApp: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  Film: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4"/></svg>),
  Loader: (p) => (<svg {...p} className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>),
  Check: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>),
  Alert: (p) => (<svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>),
};

// ===== Geração de texto local (simula IA) =====
const TEMPLATES = {
  'CFTV IP': {
    caption: (tema) => `🔒 ${tema}\n\nA vigilância por CFTV IP transforma qualquer ambiente em um espaço monitorado em tempo real. Com imagem nítida, gravação em nuvem e acesso remoto pelo celular, você não perde nenhum detalhe.\n\nIdeal para empresas, condomínios e residências que não abrem mão da segurança.\n\n#CFTVIP #SegurancaEletronica #RDSolutions #Monitoramento #Tecnologia`,
    whatsapp: (tema) => `Olá! Gostaria de falar sobre ${tema.toLowerCase()}. A RD Solutions oferece câmeras CFTV IP com acesso remoto, gravação em nuvem e instalação técnica. Podemos agendar uma visita sem compromisso?`
  },
  'Controle de Acesso': {
    caption: (tema) => `🚪 ${tema}\n\nControle quem entra e quem sai do seu condomínio ou empresa com tecnologia IP. Credenciamento por biometria, tag, senha ou aplicativo, com relatórios completos na palma da mão.\n\nSegurança, praticidade e rastreabilidade em um só sistema.\n\n#ControleDeAcesso #RDSolutions #SegurancaInteligente #Condominio`,
    whatsapp: (tema) => `Bom dia! Vi que você tem interesse em ${tema.toLowerCase()}. A RD Solutions instala sistemas completos com biometria, tag e app. Solicite um orçamento personalizado!`
  },
  Alarme: {
    caption: (tema) => `🚨 ${tema}\n\nUm alarme eficiente é o primeiro passo para evitar prejuízos. Nossos sistemas detectam movimentos suspeitos, disparam sirene e notificam você e a central de monitoramento em segundos.\n\nPrevenção real, tecnologia confiável.\n\n#Alarmes #RDSolutions #SegurancaResidencial #Protecao`,
    whatsapp: (tema) => `Olá! Quer proteger seu imóvel com um alarme moderno? A RD Solutions oferece ${tema.toLowerCase()} com monitoramento 24h. Posso te enviar uma proposta?`
  },
  Redes: {
    caption: (tema) => `🌐 ${tema}\n\nRede estruturada é a base de qualquer sistema de segurança. Cabeamento organizado, switches gerenciáveis e conectividade estável garantem que CFTV, alarmes e controle de acesso funcionem sem falhas.\n\nInvista na infraestrutura que seus equipamentos merecem.\n\n#RedesEstruturadas #RDSolutions #InfraestruturaDeRede #Seguranca`,
    whatsapp: (tema) => `Bom dia! Falando sobre ${tema.toLowerCase()}, a RD Solutions projeta e instala infraestrutura completa para suportar CFTV, alarmes e controle de acesso. Vamos conversar?`
  }
};

function detectCategory(theme) {
  const t = theme.toLowerCase();
  if (t.includes('controle') || t.includes('acesso') || t.includes('condomínio') || t.includes('biometria') || t.includes('tag')) return 'Controle de Acesso';
  if (t.includes('cftv') || t.includes('câmera') || t.includes('camera')) return 'CFTV IP';
  if (t.includes('alarme') || t.includes('sensor') || t.includes('sirene')) return 'Alarme';
  if (t.includes('rede') || t.includes('cabeamento') || t.includes('switch') || t.includes('infraestrutura')) return 'Redes';
  return 'CFTV IP';
}

function generateContent(theme) {
  const category = detectCategory(theme);
  const tmpl = TEMPLATES[category];
  const cleanTheme = theme.trim() || `Vantagens do ${category} para empresas`;
  return {
    caption: tmpl.caption(cleanTheme),
    whatsapp: tmpl.whatsapp(cleanTheme),
  };
}

// ===== Tratamento de imagem no canvas =====
function processImageOnCanvas(file, { adjust, brand }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      // Define tamanho de saída (1080x1350 = 4:5, ideal para feed do Instagram)
      const outputWidth = 1080;
      const outputHeight = 1350;

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');

      // Fundo escuro base
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Calcula crop centralizado mantendo proporção (cover)
      const scale = Math.max(outputWidth / img.width, outputHeight / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const dx = (outputWidth - drawWidth) / 2;
      const dy = (outputHeight - drawHeight) / 2;

      // Ajustes: brilho/contraste/nitidez
      if (adjust) {
        ctx.filter = 'contrast(1.08) brightness(1.05) saturate(1.1)';
      } else {
        ctx.filter = 'none';
      }

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      ctx.filter = 'none';

      // Gradiente escuro na parte inferior para legibilidade da marca
      const gradient = ctx.createLinearGradient(0, outputHeight - 280, 0, outputHeight);
      gradient.addColorStop(0, 'rgba(11, 18, 32, 0)');
      gradient.addColorStop(1, 'rgba(11, 18, 32, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, outputHeight - 280, outputWidth, 280);

      // Marca RD Solutions
      if (brand) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = 'bold 56px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('RD', 50, outputHeight - 110);

        ctx.fillStyle = '#60a5fa';
        ctx.font = '600 36px Inter, sans-serif';
        ctx.fillText('Solutions', 130, outputHeight - 110);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
        ctx.font = '500 28px Inter, sans-serif';
        ctx.fillText('Segurança Eletrônica', 50, outputHeight - 60);

        // Linha decorativa azul/laranja
        const lineGradient = ctx.createLinearGradient(50, 0, 350, 0);
        lineGradient.addColorStop(0, '#3b82f6');
        lineGradient.addColorStop(1, '#f97316');
        ctx.fillStyle = lineGradient;
        ctx.fillRect(50, outputHeight - 40, 300, 5);
      }

      resolve(canvas.toDataURL('image/png', 0.95));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erro ao carregar imagem'));
    };
    img.src = url;
  });
}

// ===== Componentes auxiliares =====
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={handle} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors">
      {copied ? <Icon.Check /> : <Icon.Copy />}
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  );
}

function UploadBox({ label, accept, file, onChange, icon: IconComp, previewIsVideo }) {
  const inputRef = useRef(null);
  const url = file ? URL.createObjectURL(file) : null;
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div
        onClick={() => inputRef.current.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors p-4 flex items-center gap-3 bg-slate-800/40"
      >
        <span className="p-2 rounded-lg bg-slate-800 text-slate-400"><IconComp /></span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300 truncate">{file ? file.name : 'Clique para escolher um arquivo'}</p>
          <p className="text-xs text-slate-500">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'PNG, JPG ou MP4'}</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files[0] || null)} />
      {url && !previewIsVideo && <img src={url} alt="preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-700" />}
      {url && previewIsVideo && <video src={url} controls className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-700" />}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [premiumAdjust, setPremiumAdjust] = useState(true);
  const [premiumBrand, setPremiumBrand] = useState(true);

  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const [caption, setCaption] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [resultVideoUrl, setResultVideoUrl] = useState(null);
  const [error, setError] = useState('');

  const canGenerate = theme.trim().length > 0;

  const handleGenerateText = async () => {
    setError('');
    setLoadingText(true);
    await new Promise(r => setTimeout(r, 700)); // pequeno delay para feedback visual
    try {
      const result = generateContent(theme);
      setCaption(result.caption);
      setWhatsapp(result.whatsapp);
    } catch (e) {
      setError('Não foi possível gerar o texto. Tente novamente.');
    } finally {
      setLoadingText(false);
    }
  };

  const handleEnhanceImage = async () => {
    if (!imageFile) return;
    setError('');
    setLoadingImage(true);
    await new Promise(r => setTimeout(r, 700));
    try {
      const dataUrl = await processImageOnCanvas(imageFile, {
        adjust: premiumAdjust,
        brand: premiumBrand,
      });
      setResultImage(dataUrl);
    } catch (e) {
      setError('Não foi possível tratar a imagem. Tente outro arquivo.');
    } finally {
      setLoadingImage(false);
    }
  };

  const handleGenerateAll = async () => {
    await handleGenerateText();
    if (imageFile) await handleEnhanceImage();
  };

  // Vídeo vai direto para o Cloudinary (evita o limite de tamanho das funções da Vercel).
  const handleEditVideo = async () => {
    if (!videoFile) return;
    setError('');
    setLoadingVideo(true);
    try {
      const cloudName = window.CLOUDINARY_CLOUD_NAME;
      const uploadPreset = window.CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary não configurado');
      }
      const form = new FormData();
      form.append('file', videoFile);
      form.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Falha ao enviar vídeo');
      const data = await res.json();

      const transformed = data.secure_url.replace(
        '/upload/',
        '/upload/c_fill,ar_9:16,g_auto/l_text:Arial_40_bold:RD%20Solutions,co_white,g_south,y_30,b_rgb:0b1220A0/'
      );
      setResultVideoUrl(transformed);
    } catch (e) {
      setError('Não foi possível editar o vídeo. Configure o Cloudinary (veja README.md) antes de usar esta parte.');
    } finally {
      setLoadingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900">
      <header className="border-b border-slate-800 sticky top-0 z-30 bg-brand-900/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-900/30">
            <span className="font-display font-bold text-white text-lg">RD</span>
          </div>
          <div>
            <h1 className="font-display font-semibold text-slate-100 leading-tight">RD Solutions</h1>
            <p className="text-xs text-slate-400">Gerador de Post — Instagram &amp; WhatsApp</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna esquerda: entrada */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-semibold text-slate-100 mb-4">1. Tema do post</h2>
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              placeholder="Ex: Vantagens do Controle de Acesso IP para condomínios"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-semibold text-slate-100 mb-4">2. Imagem</h2>
            <UploadBox label="Foto original" accept="image/*" file={imageFile} onChange={setImageFile} icon={Icon.Upload} />

            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Deixar premium</p>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={premiumAdjust} onChange={e => setPremiumAdjust(e.target.checked)} className="rounded border-slate-600 bg-slate-900 text-blue-500" />
                Ajustar cor, contraste e nitidez
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={premiumBrand} onChange={e => setPremiumBrand(e.target.checked)} className="rounded border-slate-600 bg-slate-900 text-blue-500" />
                Aplicar marca RD Solutions (logo/moldura)
              </label>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-semibold text-slate-100 mb-4 flex items-center gap-2"><Icon.Film /> 3. Vídeo (opcional)</h2>
            <UploadBox label="Vídeo original" accept="video/*" file={videoFile} onChange={setVideoFile} icon={Icon.Film} previewIsVideo />
            <button
              onClick={handleEditVideo}
              disabled={!videoFile || loadingVideo}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-sm font-medium transition-colors"
            >
              {loadingVideo ? <Icon.Loader /> : <Icon.Film />}
              {loadingVideo ? 'Editando vídeo...' : 'Editar vídeo (marca + formato 9:16)'}
            </button>
          </div>

          <button
            onClick={handleGenerateAll}
            disabled={!canGenerate || loadingText || loadingImage}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-indigo-900/30 transition-all"
          >
            {(loadingText || loadingImage) ? <Icon.Loader /> : <Icon.Sparkles />}
            {(loadingText || loadingImage) ? 'Gerando...' : 'Gerar post com IA'}
          </button>

          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-950/40 border border-red-900 text-red-300 text-sm">
              <Icon.Alert /> <span>{error}</span>
            </div>
          )}
        </div>

        {/* Coluna direita: resultado */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-slate-100 flex items-center gap-2"><Icon.Instagram /> Legenda Instagram</h2>
              {caption && <CopyButton text={caption} />}
            </div>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={6}
              placeholder="A legenda gerada pela IA aparece aqui — edite à vontade antes de postar."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm"
            />
          </div>

          <div className="glass rounded-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-slate-100 flex items-center gap-2"><Icon.WhatsApp /> Mensagem WhatsApp</h2>
              {whatsapp && <CopyButton text={whatsapp} />}
            </div>
            <textarea
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              rows={4}
              placeholder="A mensagem gerada pela IA aparece aqui — edite à vontade antes de enviar."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm"
            />
          </div>

          <div className="glass rounded-2xl p-6 animate-fadeIn">
            <h2 className="font-display font-semibold text-slate-100 mb-3">Imagem pronta</h2>
            {resultImage ? (
              <>
                <img src={resultImage} alt="Resultado" className="w-full rounded-xl border border-slate-700" />
                <a href={resultImage} download="post-rd-solutions.png" className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                  <Icon.Download /> Baixar imagem
                </a>
              </>
            ) : (
              <p className="text-sm text-slate-500">A imagem tratada aparece aqui depois de gerar.</p>
            )}
          </div>

          {resultVideoUrl && (
            <div className="glass rounded-2xl p-6 animate-fadeIn">
              <h2 className="font-display font-semibold text-slate-100 mb-3">Vídeo pronto</h2>
              <video src={resultVideoUrl} controls className="w-full rounded-xl border border-slate-700" />
              <a href={resultVideoUrl} download className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                <Icon.Download /> Baixar vídeo
              </a>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-slate-600">
        Nada aqui é salvo — gere, copie e poste manualmente. Sem banco de dados, sem login.
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
