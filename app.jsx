/**
 * RD Solutions Segurança Eletrônica
 * Dashboard de Gestão de Redes Sociais
 * React + Tailwind via CDN (sem build)
 *
 * Texto (legenda/WhatsApp) e tratamento "premium" de imagem agora usam IA de verdade
 * via /api/generate-content e /api/enhance-image (Gemini). Os posts continuam salvos
 * só no localStorage do navegador (sem banco de dados).
 */
const { useState, useEffect, useMemo, useRef } = React;

// ===== Ícones inline (Lucide-like) =====
const Icons = {
  LayoutDashboard: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>),
  Calendar: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>),
  History: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>),
  Plus: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>),
  Sparkles: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>),
  Instagram: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>),
  WhatsApp: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  X: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>),
  Save: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h8"/></svg>),
  Send: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>),
  Image: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>),
  Clock: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Check: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>),
  Alert: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>),
  Loader: () => (<svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>),
  Trash: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>),
  Menu: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>),
  Upload: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
};

// ===== Dados mock iniciais =====
const MOCK_POSTS = [
  {
    id: 'p1',
    title: 'CFTV IP: imagem cristalina 24h',
    caption_instagram: 'Segurança nunca dorme. Com nossas câmeras CFTV IP de alta resolução, você monitora cada detalhe da sua empresa ou condomínio em tempo real, direto do celular. Proteja o que importa com tecnologia de ponta.\n\n#RDSolutions #CFTV #SegurancaEletronica #Monitoramento',
    message_whatsapp: 'Olá! A RD Solutions oferece câmeras CFTV IP com imagem cristalina e acesso remoto. Que tal uma avaliação técnica sem compromisso?',
    media_url: 'https://images.unsplash.com/photo-1558002038-1091a1661116?auto=format&fit=crop&w=800&q=80',
    scheduled_at: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    status: 'published',
    target_instagram: true,
    target_whatsapp: true,
  },
  {
    id: 'p2',
    title: 'Controle de Acesso IP para condomínios',
    caption_instagram: 'Esqueça chaves e porteiros improvisados. Nosso Controle de Acesso IP oferece credenciamento por biometria, tag ou app, com registros detalhados na nuvem. Ideal para condomínios e empresas que levam a segurança a sério.\n\n#ControleDeAcesso #RDSolutions #CondominioSeguro',
    message_whatsapp: 'Quer modernizar o acesso do seu condomínio? A RD Solutions instala Controle de Acesso IP com biometria, tag e app. Solicite um orçamento!',
    media_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    scheduled_at: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    status: 'scheduled',
    target_instagram: true,
    target_whatsapp: false,
  },
  {
    id: 'p3',
    title: 'Alarmes inteligentes: prevenção ativa',
    caption_instagram: 'Um alarme não pode apenas soar — ele precisa agir. Nossos sistemas de alarme monitoram, detectam e notificam você e a central em segundos. Prevenção real, sem surpresas.\n\n#Alarmes #RDSolutions #SegurancaResidencial',
    message_whatsapp: 'Proteja seu patrimônio com alarmes inteligentes da RD Solutions. Detectamos invasões e alertamos você em segundos. Fale conosco!',
    media_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    scheduled_at: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    status: 'draft',
    target_instagram: true,
    target_whatsapp: true,
  },
];

const MOCK_LOGS = [
  { id: 'l1', post_id: 'p1', platform: 'Instagram', status: 'success', response_message: 'Publicação publicada com sucesso (API 200).', executed_at: new Date(new Date().setHours(9, 0, 0, 0)).toISOString() },
  { id: 'l2', post_id: 'p1', platform: 'WhatsApp', status: 'success', response_message: 'Mensagem enviada via API oficial.', executed_at: new Date(new Date().setHours(9, 1, 0, 0)).toISOString() },
  { id: 'l3', post_id: 'p2', platform: 'Instagram', status: 'pending', response_message: 'Aguardando horário de publicação.', executed_at: new Date().toISOString() },
];

// ===== Helpers =====
const STATUS_CONFIG = {
  draft: { label: 'Rascunho', classes: 'bg-slate-700 text-slate-200 border border-slate-600' },
  scheduled: { label: 'Agendado', classes: 'bg-blue-900/40 text-blue-300 border border-blue-700' },
  published: { label: 'Publicado', classes: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' },
  failed: { label: 'Falhou', classes: 'bg-red-900/40 text-red-300 border border-red-700' },
};

const PLATFORM_CONFIG = {
  Instagram: { icon: Icons.Instagram, classes: 'text-pink-400 bg-pink-950/40 border-pink-900' },
  WhatsApp: { icon: Icons.WhatsApp, classes: 'text-emerald-400 bg-emerald-950/40 border-emerald-900' },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Monta o mesmo texto de instrução que a API usa, mas pra você copiar e colar
// manualmente em gemini.google.com ou chatgpt.com junto com a foto.
function buildImagePrompt({ theme, adjust, brand, aiRender, format }) {
  const instructions = [];
  if (adjust) instructions.push('Melhore cor, contraste, nitidez e iluminação da foto, mantendo um resultado natural e realista.');
  if (brand) instructions.push(`No rodapé da imagem (área do chão/parede inferior), adicione um banner discreto na cor azul-escura contendo o logotipo "RD Solutions" em branco e laranja, com o slogan "Segurança Inteligente" logo abaixo em letras menores. O banner deve ser sutil, com boa legibilidade, sem cobrir o assunto principal da foto.`);
  if (aiRender) instructions.push(`Dê um acabamento premium e elaborado à imagem, coerente com o tema "${theme || 'segurança eletrônica'}", como se fosse uma peça publicitária profissional, mas preservando fielmente o conteúdo original da foto (não invente elementos que não existem na imagem).`);
  if (format === 'stories') instructions.push('Enquadre e recorte a imagem no formato vertical 9:16 (1080x1920), ideal para Stories/Reels do Instagram, mantendo o assunto principal centralizado e sem cortar partes importantes.');
  else instructions.push('Mantenha um enquadramento adequado para o feed do Instagram (formato quadrado ou levemente retangular).');
  if (instructions.length === 0) instructions.push('Melhore a qualidade geral da foto para uso profissional.');
  return `Edite esta foto para uso em post de rede social de uma empresa de segurança eletrônica. Instruções: ${instructions.join(' ')}`;
}

// Monta um prompt pra colar manualmente numa IA de vídeo (Gemini, Runway, etc.)
function buildVideoPrompt({ theme, brand, format }) {
  const instructions = [];
  instructions.push('Corte/ajuste o vídeo para uma duração curta e dinâmica, ideal para redes sociais.');
  if (brand) instructions.push('Adicione um banner discreto na cor azul-escura no rodapé do vídeo, com o logotipo "RD Solutions" em branco e laranja e o slogan "Segurança Inteligente" em letras menores logo abaixo, sem cobrir o conteúdo principal.');
  if (format === 'stories') instructions.push('Ajuste o vídeo para o formato vertical 9:16 (1080x1920), ideal para Stories/Reels do Instagram.');
  else instructions.push('Mantenha o vídeo em um formato adequado para o feed do Instagram.');
  const tema = theme ? ` sobre o tema "${theme}"` : '';
  return `Edite este vídeo${tema} para uso em post de rede social de uma empresa de segurança eletrônica. Instruções: ${instructions.join(' ')}`;
}

// ===== Chamadas de IA (via funções serverless /api) =====
async function callGenerateContent(theme) {
  const res = await fetch('/api/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });
  if (!res.ok) throw new Error('Falha ao gerar conteúdo');
  return res.json(); // { caption, whatsapp }
}

async function callEnhanceImage({ image, mimeType, theme, adjust, brand, aiRender }) {
  const res = await fetch('/api/enhance-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image, mimeType, theme, adjust, brand, aiRender }),
  });
  if (!res.ok) throw new Error('Falha ao tratar imagem');
  const data = await res.json(); // { image, mimeType }
  return `data:${data.mimeType};base64,${data.image}`;
}

// ===== Componentes =====
function Sidebar({ activeTab, setActiveTab, onNewPost }) {
  const [open, setOpen] = useState(false);
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { id: 'calendar', label: 'Calendário', icon: Icons.Calendar },
    { id: 'logs', label: 'Logs / Histórico', icon: Icons.History },
  ];
  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 glass sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center font-bold text-white">RD</div>
          <span className="font-semibold text-slate-100">RD Solutions</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"><Icons.Menu /></button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 bg-brand-900 border-r border-slate-800 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-900/30">
            <span className="font-bold text-white text-lg">RD</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-100 leading-tight">RD Solutions</h1>
            <p className="text-xs text-slate-400">Segurança Eletrônica</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={() => { onNewPost(); setOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/30 transition-all"
          >
            <Icons.Plus />
            Novo Post com IA
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-5 hover:border-slate-600 transition-colors">
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.classes}`}>
      {status === 'published' && <Icons.Check />}
      {status === 'failed' && <Icons.Alert />}
      {cfg.label}
    </span>
  );
}

function PostCard({ post, onEdit, onDelete }) {
  return (
    <div className="glass rounded-2xl overflow-hidden hover:border-slate-600 transition-all group">
      {post.media_url && (
        <div className="h-36 bg-slate-800 relative overflow-hidden">
          <img src={post.media_url} alt={post.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
          <div className="absolute top-3 right-3"><StatusBadge status={post.status} /></div>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-slate-100 line-clamp-1" title={post.title}>{post.title}</h3>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2 h-10">{post.caption_instagram}</p>
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
          <Icons.Calendar />
          <span>{formatDateTime(post.scheduled_at)}</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          {post.target_instagram && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-pink-950/40 text-pink-400 border border-pink-900"><Icons.Instagram /> Instagram</span>}
          {post.target_whatsapp && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-950/40 text-emerald-400 border border-emerald-900"><Icons.WhatsApp /> WhatsApp</span>}
        </div>
        <div className="flex items-center gap-2 mt-5">
          <button onClick={() => onEdit(post)} className="flex-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors">Editar</button>
          <button onClick={() => onDelete(post.id)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors"><Icons.Trash /></button>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ posts, onNewPost, onEdit, onDelete }) {
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter(p => p.status === 'published').length;
    const scheduled = posts.filter(p => p.status === 'scheduled').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    return { total, published, scheduled, drafts };
  }, [posts]);

  const recentPosts = useMemo(() => [...posts].sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at)).slice(0, 6), [posts]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Visão geral das postagens da RD Solutions.</p>
        </div>
        <button onClick={() => onNewPost()} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/30 transition-all">
          <Icons.Plus />
          Novo Post com IA
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Posts" value={stats.total} sub="Criados no sistema" />
        <StatCard label="Publicados" value={stats.published} sub="Publicações concluídas" />
        <StatCard label="Agendados" value={stats.scheduled} sub="Na fila de envio" />
        <StatCard label="Rascunhos" value={stats.drafts} sub="Pendentes de revisão" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Postagens recentes</h3>
          <span className="text-sm text-slate-500">{recentPosts.length} exibidos</span>
        </div>
        {recentPosts.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-slate-400">Nenhuma postagem encontrada.</p>
            <button onClick={() => onNewPost()} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"><Icons.Plus /> Criar primeiro post</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recentPosts.map(post => <PostCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarView({ posts, onEdit, onNewPost }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => addDays(getStartOfWeek(new Date()), weekOffset * 7), [weekOffset]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const postsByDay = useMemo(() => {
    const map = {};
    weekDays.forEach(day => { map[day.toDateString()] = []; });
    posts.forEach(post => {
      const d = new Date(post.scheduled_at).toDateString();
      if (map[d]) map[d].push(post);
    });
    return map;
  }, [posts, weekDays]);

  const isToday = (d) => d.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Calendário Semanal</h2>
          <p className="text-slate-400 text-sm mt-1">Visualize e organize as postagens da semana.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(w => w - 1)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm">← Anterior</button>
          <span className="px-3 py-2 text-sm text-slate-300 font-medium min-w-[140px] text-center">{formatDate(weekStart)}</span>
          <button onClick={() => setWeekOffset(w => w + 1)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm">Próxima →</button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm">Hoje</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, idx) => {
          const label = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][idx];
          const list = postsByDay[day.toDateString()] || [];
          return (
            <div key={idx} className={`glass rounded-2xl p-3 min-h-[180px] flex flex-col ${isToday(day) ? 'ring-1 ring-blue-500/50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">{label}</span>
                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>{day.getDate()}</span>
              </div>
              <div className="space-y-2 flex-1">
                {list.map(post => (
                  <button key={post.id} onClick={() => onEdit(post)} className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors">
                    <p className="text-xs font-medium text-slate-200 line-clamp-2">{post.title}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1"><Icons.Clock /> {formatTime(post.scheduled_at)}</span>
                      <StatusBadge status={post.status} />
                    </div>
                  </button>
                ))}
                {list.length === 0 && <p className="text-xs text-slate-600 mt-2">Nenhuma postagem</p>}
              </div>
              <button onClick={() => onNewPost(day)} className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 text-xs transition-colors">+ Novo</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LogsView({ logs, posts }) {
  const postMap = useMemo(() => Object.fromEntries(posts.map(p => [p.id, p])), [posts]);
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Logs / Histórico</h2>
        <p className="text-slate-400 text-sm mt-1">Registro de envios e retornos das APIs.</p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/60 text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Data/Hora</th>
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Plataforma</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Retorno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-500">Nenhum log registrado.</td></tr>
              )}
              {[...logs].sort((a, b) => new Date(b.executed_at) - new Date(a.executed_at)).map(log => {
                const Icon = PLATFORM_CONFIG[log.platform]?.icon || Icons.Instagram;
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{formatDateTime(log.executed_at)}</td>
                    <td className="px-5 py-3 text-slate-300">{postMap[log.post_id]?.title || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border ${PLATFORM_CONFIG[log.platform]?.classes || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        <Icon /> {log.platform}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : log.status === 'failed' ? 'bg-red-900/40 text-red-300 border border-red-700' : 'bg-blue-900/40 text-blue-300 border border-blue-700'}`}>
                        {log.status === 'success' ? <Icons.Check /> : log.status === 'failed' ? <Icons.Alert /> : <Icons.Clock />}
                        {log.status === 'success' ? 'Sucesso' : log.status === 'failed' ? 'Falhou' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 max-w-xs truncate" title={log.response_message}>{log.response_message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PostModal({ isOpen, onClose, initialDate, editPost, onSave }) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [targetInstagram, setTargetInstagram] = useState(true);
  const [targetWhatsapp, setTargetWhatsapp] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // Estado da imagem: arquivo local + opções "premium" + estado de tratamento
  const [imageFile, setImageFile] = useState(null);
  const [format, setFormat] = useState('feed'); // 'feed' | 'stories' — vale para imagem e vídeo
  const [premiumAdjust, setPremiumAdjust] = useState(true);
  const [premiumBrand, setPremiumBrand] = useState(true);
  const [premiumAI, setPremiumAI] = useState(false);
  const [treatingImage, setTreatingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Estado do vídeo (mesmo espírito da imagem: sem chamada automática de IA — copia prompt manual)
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPromptCopied, setVideoPromptCopied] = useState(false);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setGenError('');
    setImageError('');
    setImageFile(null);
    setVideoFile(null);
    setVideoUrl('');
    if (editPost) {
      setTitle(editPost.title);
      setCaption(editPost.caption_instagram);
      setMessage(editPost.message_whatsapp);
      setMediaUrl(editPost.media_url);
      setVideoUrl(editPost.video_url || '');
      setFormat(editPost.format || 'feed');
      setScheduledAt(editPost.scheduled_at.slice(0, 16));
      setTargetInstagram(editPost.target_instagram);
      setTargetWhatsapp(editPost.target_whatsapp);
    } else {
      const base = (initialDate instanceof Date && !isNaN(initialDate)) ? new Date(initialDate) : new Date();
      base.setMinutes(0, 0, 0);
      if (!(initialDate instanceof Date)) base.setHours(base.getHours() + 1);
      setTitle('');
      setCaption('');
      setMessage('');
      setMediaUrl('');
      setFormat('feed');
      setScheduledAt(base.toISOString().slice(0, 16));
      setTargetInstagram(true);
      setTargetWhatsapp(true);
    }
  }, [isOpen, editPost, initialDate]);

  if (!isOpen) return null;

  // Gera legenda + mensagem de WhatsApp via IA real (Gemini, através de /api/generate-content)
  const handleGenerate = async () => {
    if (!title.trim()) return;
    setGenError('');
    setGenerating(true);
    try {
      const result = await callGenerateContent(title);
      setCaption(result.caption || '');
      setMessage(result.whatsapp || '');
    } catch (e) {
      setGenError('Não foi possível gerar o texto com IA. Tente novamente em instantes.');
    } finally {
      setGenerating(false);
    }
  };

  // Trata a imagem enviada com IA (ajuste, marca RD Solutions e/ou versão elaborada)
  const handleTreatImage = async () => {
    if (!imageFile) return;
    setImageError('');
    setTreatingImage(true);
    try {
      const base64 = await fileToBase64(imageFile);
      const dataUrl = await callEnhanceImage({
        image: base64,
        mimeType: imageFile.type,
        theme: title,
        adjust: premiumAdjust,
        brand: premiumBrand,
        aiRender: premiumAI,
        format,
      });
      setMediaUrl(dataUrl);
    } catch (e) {
      setImageError('Não foi possível tratar a imagem com IA. Verifique a GOOGLE_API_KEY na Vercel e tente de novo.');
    } finally {
      setTreatingImage(false);
    }
  };

  // Usa o arquivo selecionado (ex: a imagem já baixada do Gemini/ChatGPT) direto como imagem final,
  // sem chamar a API de tratamento.
  const handleUseFileDirectly = async () => {
    if (!imageFile) return;
    const base64 = await fileToBase64(imageFile);
    setMediaUrl(`data:${imageFile.type};base64,${base64}`);
  };

  // Copia o prompt pronto pra colar manualmente no site do Gemini/ChatGPT junto com a foto
  const handleCopyPrompt = () => {
    const prompt = buildImagePrompt({ theme: title, adjust: premiumAdjust, brand: premiumBrand, aiRender: premiumAI, format });
    navigator.clipboard.writeText(prompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  // Copia o prompt pronto pra colar manualmente numa IA de vídeo, junto com o arquivo de vídeo
  const handleCopyVideoPrompt = () => {
    const prompt = buildVideoPrompt({ theme: title, brand: premiumBrand, format });
    navigator.clipboard.writeText(prompt);
    setVideoPromptCopied(true);
    setTimeout(() => setVideoPromptCopied(false), 2000);
  };

  // Usa o vídeo selecionado (ex: já editado e baixado da IA) direto como vídeo final do post
  const handleUseVideoDirectly = async () => {
    if (!videoFile) return;
    const base64 = await fileToBase64(videoFile);
    setVideoUrl(`data:${videoFile.type};base64,${base64}`);
  };

  const handleSubmit = (status) => {
    const payload = {
      id: editPost ? editPost.id : generateId('post'),
      title: title.trim() || 'Sem título',
      caption_instagram: caption,
      message_whatsapp: message,
      media_url: mediaUrl,
      video_url: videoUrl,
      format,
      scheduled_at: new Date(scheduledAt).toISOString(),
      status,
      target_instagram: targetInstagram,
      target_whatsapp: targetWhatsapp,
    };
    onSave(payload, editPost ? 'update' : 'create', status);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="modal-enter w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl p-6 sm:p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">{editPost ? 'Editar Postagem' : 'Novo Post com IA'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><Icons.X /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Tema do Post</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Vantagens do Controle de Acesso IP para condomínios"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!title.trim() || generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
          >
            {generating ? <Icons.Loader /> : <Icons.Sparkles />}
            {generating ? 'Gerando conteúdo com IA...' : 'Gerar texto com IA'}
          </button>
          {genError && <p className="text-xs text-red-400 flex items-center gap-1.5"><Icons.Alert /> {genError}</p>}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Legenda do Instagram</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={5}
              placeholder="A IA preencherá aqui a legenda otimizada para o Instagram..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Mensagem do WhatsApp</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              placeholder="A IA preencherá aqui a mensagem direta para o WhatsApp..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
            />
          </div>

          {/* ===== Formato: Feed ou Stories ===== */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Formato</label>
            <div className="flex items-center gap-3">
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${format === 'feed' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                <input type="radio" name="format" value="feed" checked={format === 'feed'} onChange={() => setFormat('feed')} className="hidden" />
                <Icons.Image /> Feed do Instagram
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${format === 'stories' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                <input type="radio" name="format" value="stories" checked={format === 'stories'} onChange={() => setFormat('stories')} className="hidden" />
                <Icons.Sparkles /> Stories (9:16)
              </label>
            </div>
          </div>

          {/* ===== Imagem: upload + tratamento premium por IA ===== */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Imagem do Post</label>

            <div
              onClick={() => fileInputRef.current.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors p-4 flex items-center gap-3 bg-slate-800/40"
            >
              <span className="p-2 rounded-lg bg-slate-800 text-slate-400"><Icons.Upload /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{imageFile ? imageFile.name : 'Clique para escolher uma foto do seu computador'}</p>
                <p className="text-xs text-slate-500">PNG ou JPG</p>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0] || null)} />

            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Deixar premium</p>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={premiumAdjust} onChange={e => setPremiumAdjust(e.target.checked)} className="rounded border-slate-600 bg-slate-900 text-blue-500" />
                Ajustar cor, contraste e nitidez
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={premiumBrand} onChange={e => setPremiumBrand(e.target.checked)} className="rounded border-slate-600 bg-slate-900 text-blue-500" />
                Aplicar marca RD Solutions (logo/moldura)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={premiumAI} onChange={e => setPremiumAI(e.target.checked)} className="rounded border-slate-600 bg-slate-900 text-blue-500" />
                Gerar versão elaborada com IA
              </label>
            </div>

            <button
              onClick={handleTreatImage}
              disabled={!imageFile || treatingImage}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
            >
              {treatingImage ? <Icons.Loader /> : <Icons.Sparkles />}
              {treatingImage ? 'Tratando imagem com IA...' : 'Tratar imagem com IA (automático)'}
            </button>
            {imageError && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5"><Icons.Alert /> {imageError}</p>}

            <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">
                Se a cota da IA estiver esgotada, copie o prompt abaixo e cole junto com a foto em{' '}
                <a href="https://gemini.google.com" target="_blank" rel="noopener" className="text-blue-400 hover:underline">gemini.google.com</a>{' '}
                ou <a href="https://chatgpt.com" target="_blank" rel="noopener" className="text-blue-400 hover:underline">chatgpt.com</a>.
                Depois baixe a imagem gerada e envie ela pelo botão de upload acima.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-medium transition-colors"
                >
                  {promptCopied ? <Icons.Check /> : <Icons.Sparkles />}
                  {promptCopied ? 'Copiado!' : 'Copiar prompt'}
                </button>
                <button
                  onClick={handleUseFileDirectly}
                  disabled={!imageFile}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-xs font-medium transition-colors"
                >
                  <Icons.Upload /> Usar foto selecionada
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Selecione a foto já tratada (baixada do site) no campo acima e clique em "Usar foto selecionada".</p>
            </div>

            {mediaUrl && <img src={mediaUrl} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-700" onError={e => e.target.style.display = 'none'} />}
          </div>

          {/* ===== Vídeo (opcional): mesmo fluxo de prompt manual da imagem ===== */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Vídeo do Post (opcional)</label>

            <div
              onClick={() => videoInputRef.current.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors p-4 flex items-center gap-3 bg-slate-800/40"
            >
              <span className="p-2 rounded-lg bg-slate-800 text-slate-400"><Icons.Upload /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{videoFile ? videoFile.name : 'Clique para escolher um vídeo curto'}</p>
                <p className="text-xs text-slate-500">MP4 — ideal até 30-60s</p>
              </div>
            </div>
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => setVideoFile(e.target.files[0] || null)} />

            <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">
                Vídeo é pesado demais para tratar automaticamente aqui. Copie o prompt, cole junto com o vídeo em{' '}
                <a href="https://gemini.google.com" target="_blank" rel="noopener" className="text-blue-400 hover:underline">gemini.google.com</a>{' '}
                (ou outra IA de vídeo de sua preferência), baixe o resultado e selecione ele acima.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyVideoPrompt}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-medium transition-colors"
                >
                  {videoPromptCopied ? <Icons.Check /> : <Icons.Sparkles />}
                  {videoPromptCopied ? 'Copiado!' : 'Copiar prompt'}
                </button>
                <button
                  onClick={handleUseVideoDirectly}
                  disabled={!videoFile}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 text-xs font-medium transition-colors"
                >
                  <Icons.Upload /> Usar vídeo selecionado
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Selecione o vídeo já editado (baixado do site) no campo acima e clique em "Usar vídeo selecionado".</p>
            </div>

            {videoUrl && <video src={videoUrl} controls className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-700" />}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Data e Hora do Agendamento</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Destino da Publicação</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer hover:border-pink-500/40 transition-colors">
                <input type="checkbox" checked={targetInstagram} onChange={e => setTargetInstagram(e.target.checked)} className="w-4 h-4 rounded border-slate-600 text-pink-500 focus:ring-pink-500/40 bg-slate-900" />
                <Icons.Instagram />
                <span className="text-sm text-slate-200">Instagram</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer hover:border-emerald-500/40 transition-colors">
                <input type="checkbox" checked={targetWhatsapp} onChange={e => setTargetWhatsapp(e.target.checked)} className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/40 bg-slate-900" />
                <Icons.WhatsApp />
                <span className="text-sm text-slate-200">WhatsApp</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-8">
          <button onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">Cancelar</button>
          <button onClick={() => handleSubmit('draft')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors"><Icons.Save /> Salvar Rascunho</button>
          <button onClick={() => handleSubmit('scheduled')} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/30 transition-all"><Icons.Send /> Agendar Publicação</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-5 right-5 z-[70] px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-xl flex items-center gap-2">
      <Icons.Check /> {message}
    </div>
  );
}

// ===== App principal =====
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('rd_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('rd_logs');
    return saved ? JSON.parse(saved) : MOCK_LOGS;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem('rd_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('rd_logs', JSON.stringify(logs)); }, [logs]);

  const openNewPost = (date = null) => { setEditPost(null); setModalInitialDate(date); setModalOpen(true); };
  const openEdit = (post) => { setEditPost(post); setModalInitialDate(null); setModalOpen(true); };

  const handleSave = (payload, mode, status) => {
    setPosts(prev => {
      if (mode === 'update') return prev.map(p => p.id === payload.id ? payload : p);
      return [...prev, payload];
    });

    const newLogs = [];
    if (status === 'scheduled') {
      if (payload.target_instagram) {
        newLogs.push({ id: generateId('log'), post_id: payload.id, platform: 'Instagram', status: 'pending', response_message: 'Agendado para publicação automática.', executed_at: new Date().toISOString() });
      }
      if (payload.target_whatsapp) {
        newLogs.push({ id: generateId('log'), post_id: payload.id, platform: 'WhatsApp', status: 'pending', response_message: 'Agendado para envio automático.', executed_at: new Date().toISOString() });
      }
    } else if (status === 'draft') {
      newLogs.push({ id: generateId('log'), post_id: payload.id, platform: 'Sistema', status: 'success', response_message: 'Rascunho salvo com sucesso.', executed_at: new Date().toISOString() });
    }
    if (newLogs.length) setLogs(prev => [...prev, ...newLogs]);

    setModalOpen(false);
    setToast(mode === 'update' ? 'Postagem atualizada!' : status === 'scheduled' ? 'Publicação agendada!' : 'Rascunho salvo!');
  };

  const handleDelete = (id) => {
    if (!confirm('Deseja realmente excluir esta postagem?')) return;
    setPosts(prev => prev.filter(p => p.id !== id));
    setToast('Postagem excluída.');
  };

  return (
    <div className="min-h-screen bg-brand-900 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNewPost={() => openNewPost()} />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && <DashboardView posts={posts} onNewPost={openNewPost} onEdit={openEdit} onDelete={handleDelete} />}
        {activeTab === 'calendar' && <CalendarView posts={posts} onEdit={openEdit} onNewPost={openNewPost} />}
        {activeTab === 'logs' && <LogsView logs={logs} posts={posts} />}
      </main>
      <PostModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialDate={modalInitialDate} editPost={editPost} onSave={handleSave} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
