import React, { useState, useEffect, useRef } from 'react';

// ── Empathy Ledger API ──────────────────────────────────────────────────

const EMPATHY_API = 'https://empathy-ledger-v2.vercel.app/api/v1/content-hub';
const OONCHIUMPA_PROJECT = 'oonchiumpa';

interface Quote {
  text: string;
  theme: string;
  category: string;
  impactScore: number;
  storyteller: {
    id: string;
    name: string;
    avatarUrl: string | null;
    location: string | null;
    culturalBackground: string[] | null;
  };
}

interface Story {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  themes: string[];
  publishedAt: string;
}

const toLabel = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const candidate = (value as Record<string, unknown>).name ??
      (value as Record<string, unknown>).theme ??
      (value as Record<string, unknown>).label ??
      (value as Record<string, unknown>).title;
    if (typeof candidate === 'string') return candidate;
  }
  return '';
};

const normalizeThemes = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toLabel(item).trim())
    .filter(Boolean);
};

async function fetchQuotes(): Promise<Quote[]> {
  try {
    const res = await fetch(`${EMPATHY_API}/quotes?limit=12&min_impact=4&source=all&project=${OONCHIUMPA_PROJECT}`);
    if (!res.ok) return [];
    const data = await res.json();
    const quotes = Array.isArray(data.quotes) ? data.quotes : [];

    return quotes.map((item: Record<string, unknown>, index: number) => {
      const storytellerRaw =
        item.storyteller && typeof item.storyteller === 'object'
          ? (item.storyteller as Record<string, unknown>)
          : {};

      const storytellerName = toLabel(storytellerRaw.name).trim() || 'Community voice';
      const culturalBackgroundRaw = storytellerRaw.culturalBackground;
      const culturalBackground = Array.isArray(culturalBackgroundRaw)
        ? culturalBackgroundRaw
            .map((entry) => toLabel(entry).trim())
            .filter(Boolean)
        : null;

      return {
        text: toLabel(item.text) || '',
        theme: toLabel(item.theme),
        category: toLabel(item.category),
        impactScore:
          typeof item.impactScore === 'number' ? item.impactScore : 0,
        storyteller: {
          id: toLabel(storytellerRaw.id) || `storyteller-${index}`,
          name: storytellerName,
          avatarUrl:
            typeof storytellerRaw.avatarUrl === 'string'
              ? storytellerRaw.avatarUrl
              : null,
          location:
            typeof storytellerRaw.location === 'string'
              ? storytellerRaw.location
              : null,
          culturalBackground,
        },
      } as Quote;
    });
  } catch { return []; }
}

async function fetchStories(): Promise<Story[]> {
  try {
    const res = await fetch(`${EMPATHY_API}/stories?limit=6&project=${OONCHIUMPA_PROJECT}`);
    if (!res.ok) return [];
    const data = await res.json();
    const stories = Array.isArray(data.stories) ? data.stories : [];

    return stories.map((item: Record<string, unknown>, index: number) => {
      const authorSource =
        item.authorName ??
        item.author_name ??
        item.author ??
        item.storyteller;

      return {
        id: toLabel(item.id) || `story-${index}`,
        title: toLabel(item.title) || 'Community story',
        summary: toLabel(item.summary) || toLabel(item.excerpt) || '',
        authorName: toLabel(authorSource) || 'Community voice',
        themes: normalizeThemes(item.themes),
        publishedAt: toLabel(item.publishedAt) || toLabel(item.published_at),
      };
    });
  } catch { return []; }
}

// ── SVG Icons ───────────────────────────────────────────────────────────

const Icon = {
  justice: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" /></svg>,
  disability: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  academic: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>,
  chevron: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  quote: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" opacity={0.3}><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" /></svg>,
  arrow: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>,
};

// ── Grain Overlay ───────────────────────────────────────────────────────

const grainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`;

// ── Data ────────────────────────────────────────────────────────────────

const STATS = [
  { value: '~$3M', label: "Oonchiumpa's annual funding", sub: 'NIAA, to be confirmed' },
  { value: '$4,000', label: 'Cost per day to detain one child', sub: '98% Aboriginal' },
  { value: '$50M', label: 'NDIS budgets unspent per year', sub: 'Central Australia' },
  { value: '90%', label: 'Oonchiumpa retention rate', sub: '95% school re-engagement' },
];

const FUNDING = [
  { label: 'Youth Detention (NT)', amount: 530_000_000, per: '10 years', color: '#ef4444', note: '98% Aboriginal children' },
  { label: 'Community Supervision', amount: 352_000_000, per: '10 years', color: '#f87171' },
  { label: 'NDIS (Central Aust.)', amount: 238_000_000, per: 'year committed', color: '#71717a', note: '21% goes unspent' },
  { label: 'Don Dale Replacement', amount: 55_000_000, per: 'capital', color: '#fca5a5' },
  { label: 'Tangentyere Council', amount: 35_000_000, per: 'total', color: '#34d399' },
  { label: 'Bushmob', amount: 4_700_000, per: 'total', color: '#6ee7b7' },
  { label: 'Oonchiumpa', amount: 3_000_000, per: 'year (NIAA)', color: '#fbbf24', note: '7 language groups, 90% retention' },
];

const SECTORS = [
  { name: 'Youth Justice', icon: Icon.justice, spend: '$97M/yr', problem: '55% on detention. $4,000/day per child. 98% Aboriginal.', hub: 'On-country diversion through cultural authority and True Justice.', accent: '#ef4444' },
  { name: 'Disability (NDIS)', icon: Icon.disability, spend: '$238M committed', problem: '79% utilisation. $50M/year unspent. 57% for kids under 8.', hub: 'Cultural brokerage unlocks plans. One navigation point per family.', accent: '#fbbf24' },
  { name: 'Child Protection', icon: Icon.shield, spend: '$3.16B total', problem: 'Highest removal rate in nation. Caseworker churn. Cultural disconnect.', hub: 'Community-led family support. Prevention through connection.', accent: '#a78bfa' },
  { name: 'Education', icon: Icon.academic, spend: 'Crisis-level', problem: 'Attendance crisis. Suspension, exclusion, streets. No NDIS integration.', hub: '95% school re-engagement. Elder liaison. Boarding support.', accent: '#34d399' },
];

const JOURNEYS = [
  {
    name: 'Tyson: The Current System', age: 14, place: 'Alice Springs town camp', variant: 'destructive' as const,
    steps: [
      "Mum has disability. NDIS plan managed from Darwin. Tyson is informal carer, nobody's noticed.",
      'Stops attending school. Reported to TFHC. Third caseworker in 18 months.',
      'Night Patrol picks him up at 2am. Doesn\'t know the workers. Goes back out.',
      'Five separate systems, five case files, five intake forms. None speak Arrernte.',
      'Don Dale or Alice Springs Youth Justice Centre. $4,000/day.',
      'Released. No connection. Cycle repeats. $500K+ over 3 years.',
    ],
    outcome: 'Worse than where he started. Cultural connection: near zero.',
  },
  {
    name: 'Tyson: The Oonchiumpa Way', age: 14, place: 'Alice Springs town camp', variant: 'positive' as const,
    steps: [
      'Elder already knows Tyson\'s family. Knows his grandmother is a senior lawwoman.',
      'Takes him to Atnarpa for a few days on country. Works with him on what he wants.',
      'Navigates mum\'s NDIS plan. Gets supports in place so Tyson isn\'t carrying the carer load.',
      'Youth mentorship program. Regular contact, school engagement, on-country time.',
      'When trouble comes, True Justice program. Real diversion through law and culture.',
      'Stays connected. Stays in school. Grandmother teaches him responsibility to his land.',
    ],
    outcome: 'A young man who knows who he is and where he belongs.',
  },
  {
    name: 'Marlene: Homelands', age: 16, place: 'MacDonnell Shire', variant: 'destructive' as const,
    steps: [
      'Lives 200km out. NDIS plan $177K committed. Provider hasn\'t visited in 6 months.',
      'Needs Alice Springs for appointments. No transport. Falls through the cracks.',
      'Health crisis. Swept into child protection: living conditions, not parenting.',
      'Removed from country. Non-family placement. Runs away. Youth justice begins.',
    ],
    outcome: 'With the hub: Oonchiumpa already operates on homelands. Marlene stays connected.',
  },
  {
    name: 'Danny: Disability Spiral', age: 11, place: 'Central Desert', variant: 'destructive' as const,
    steps: [
      'FASD diagnosed at 9 (should have been 5). Provider in Adelaide. 22% utilisation.',
      'Boarding school manages behaviour as discipline, not disability. Suspended three times.',
      'Three bureaucracies that don\'t talk. Child protection AND education AND disability.',
      'By 14: ABI from placement breakdown. Plan jumps to $467K. Also in youth justice. $1.5M+/year.',
    ],
    outcome: 'With the hub: Early diagnosis. Cultural broker coordinates NDIS, school, family.',
  },
];

const PILLARS = [
  { title: 'One Door, One Relationship', desc: 'An elder who knows the young person, their family, their country, their language.' },
  { title: 'Cultural Foundation', desc: 'Identity, language, law, ceremony as the base, not a module bolted on.' },
  { title: 'NDIS Navigation', desc: 'Coordinating plans across families. Pushing utilisation from 57% to 90%.' },
  { title: 'On-Country Healing', desc: 'Atnarpa Homestead. Bush tucker. Deep listening with judges and elders.' },
  { title: 'Family & Community', desc: 'Three NDIS plans in one family? One navigation point.' },
  { title: 'Transition Support', desc: 'Detention to community. School to work. Town to homeland. Always connected.' },
];

const PHASES = [
  { n: 1, title: 'Build the Evidence', time: 'Now', items: ['CivicGraph data analysis', 'Oonchiumpa outcomes data', 'True Justice documentation', 'NDIS utilisation gap analysis'] },
  { n: 2, title: 'Gather the Voices', time: '4 weeks', items: ['Young people\'s stories', 'Elder guidance on hub model', 'Judge perspectives', 'Service provider support'] },
  { n: 3, title: 'Build the Proposal', time: 'Weeks 5-8', items: ['Formal budget', 'NDIS provider pathway', 'Partnership agreements', 'Evidence summary'] },
  { n: 4, title: 'Go to Funders', time: 'Weeks 9-12', items: ['Paul Ramsay Foundation', 'NIAA Closing the Gap', 'NDIA Remote Delivery', 'NTG ministerial briefing'] },
  { n: 5, title: 'Go Public', time: 'Month 4+', items: ['Media package', 'Community launch at Atnarpa', 'Funding flow visualisation', 'Young people\'s voices'] },
];

// ── Helpers ─────────────────────────────────────────────────────────────

function money(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

function barPct(amount: number, max: number): number {
  return Math.max((Math.log10(Math.max(amount, 1)) / Math.log10(max)) * 100, 3);
}

// ── Animate on scroll ───────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback so content is not left invisible if observer callbacks are delayed or blocked.
    const fallbackTimer = window.setTimeout(() => setVisible(true), 1200);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      window.clearTimeout(fallbackTimer);
      return;
    }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        window.clearTimeout(fallbackTimer);
        obs.disconnect();
      }
    }, { threshold });

    obs.observe(el);
    return () => {
      window.clearTimeout(fallbackTimer);
      obs.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// ── Glass Card ──────────────────────────────────────────────────────────

const Glass: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ children, className = '', hover = false }) => (
  <div className={`
    rounded-2xl border border-white/[0.08]
    ${hover ? 'hover:border-white/[0.15] hover:scale-[1.02] cursor-default' : ''}
    transition-all duration-300
    ${className}
  `} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
    {children}
  </div>
);

// ── Journey Card ────────────────────────────────────────────────────────

const JourneyCard: React.FC<{ j: typeof JOURNEYS[0] }> = ({ j }) => {
  const [open, setOpen] = useState(false);
  const isPositive = j.variant === 'positive';
  const accent = isPositive ? '#34d399' : '#ef4444';

  return (
    <Glass className="overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-5 flex items-center justify-between text-left group">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <div>
            <span className="text-sm font-medium text-white">{j.name}</span>
            <span className="text-xs text-zinc-500 ml-3">{j.age}, {j.place}</span>
          </div>
        </div>
        <span className={`text-zinc-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>{Icon.chevron}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-white/[0.06]">
          <div className="pt-5 space-y-3">
            {j.steps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1.5">
                  <div className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-black" style={{ background: accent }}>{i + 1}</div>
                  {i < j.steps.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: `${accent}30` }} />}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed pb-2">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl" style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}>
            <p className="text-sm font-medium" style={{ color: accent }}>{j.outcome}</p>
          </div>
        </div>
      )}
    </Glass>
  );
};

// ── Page ────────────────────────────────────────────────────────────────

const YouthHubPage: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const maxFunding = Math.max(...FUNDING.map(f => f.amount));

  useEffect(() => {
    fetchQuotes().then(setQuotes);
    fetchStories().then(setStories);
  }, []);

  return (
    <div className="bg-black text-white font-['Inter',sans-serif] min-h-screen relative">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50" style={{ backgroundImage: grainSvg, opacity: 0.04 }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black" />
        <div className="relative z-10 max-w-3xl text-center">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-6">Oonchiumpa Consultancy & Services</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-medium tracking-[-0.04em] leading-[1.05] mb-6">
              The Oonchiumpa Way
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              One hub on country, run by traditional owners, wrapping around the whole young person: across disability, justice, education, and child protection.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => document.getElementById('evidence')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-zinc-200 transition-colors"
              >
                See the Evidence
              </button>
              <button
                onClick={() => document.getElementById('voices')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 border border-white/20 text-sm font-medium rounded-full hover:bg-white/5 transition-colors"
              >
                Hear the Voices
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Glass className="p-6 text-center" hover>
                <div className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-2">{s.value}</div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500 mb-1">{s.label}</div>
                <div className="text-[10px] text-zinc-600">{s.sub}</div>
              </Glass>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Funding ──────────────────────────────────────────── */}
      <section id="evidence" className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">Follow the Money</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-4">Where the Money Goes</h2>
            <p className="text-base text-zinc-500 font-light mb-12 max-w-xl">
              The system spends <span className="text-sunset-400 font-medium">177x more</span> on youth detention
              than on the traditional owners who keep young people connected.
            </p>
          </Reveal>

          <Glass className="p-6 md:p-8">
            {FUNDING.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="mb-5 last:mb-0">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-zinc-300">{f.label}</span>
                    <span className="text-sm tabular-nums text-zinc-500">{money(f.amount)} <span className="text-zinc-700">/ {f.per}</span></span>
                  </div>
                  <div className="h-6 bg-white/[0.04] rounded overflow-hidden">
                    <div
                      className="h-full rounded flex items-center transition-all duration-1000"
                      style={{ width: `${barPct(f.amount, maxFunding)}%`, background: f.color }}
                    >
                      {f.note && <span className="text-[9px] text-black/70 font-medium pl-2 whitespace-nowrap">{f.note}</span>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <p className="text-[10px] text-zinc-700 mt-6 pt-4 border-t border-white/[0.06]">
              Sources: ROGS, NDIA Dec 2025, NIAA, AusTender. Log scale.
            </p>
          </Glass>
        </div>
      </section>

      {/* ── Sectors ──────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">Cross-Sector Failure</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-4">Four Systems, One Young Person</h2>
            <p className="text-base text-zinc-500 font-light mb-12 max-w-xl">
              Each system has its own intake, case file, and rotating staff. None have a relationship that predates the crisis.
              <span className="text-eucalyptus-400 font-medium"> Oonchiumpa has all four.</span>
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {SECTORS.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Glass className="p-6" hover>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{s.name}</h3>
                      <span className="text-lg font-medium" style={{ color: s.accent }}>{s.spend}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-sunset-400/60 mb-1">The Problem</p>
                      <p className="text-sm text-zinc-500 leading-relaxed">{s.problem}</p>
                    </div>
                    <div className="pt-3 border-t border-white/[0.06]">
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-eucalyptus-400/60 mb-1">The Hub Role</p>
                      <p className="text-sm text-zinc-300 font-medium leading-relaxed">{s.hub}</p>
                    </div>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Voices (Empathy Ledger) ──────────────────────────── */}
      <section id="voices" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">Real Voices</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-4">From the Community</h2>
            <p className="text-base text-zinc-500 font-light mb-12 max-w-xl">
              Voices from Oonchiumpa's community: elders, young people, and the team.
            </p>
          </Reveal>

          {quotes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotes.slice(0, 9).map((q, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <Glass className="p-6 flex flex-col justify-between min-h-[200px]" hover>
                    <div>
                      <div className="text-eucalyptus-400/30 mb-3">{Icon.quote}</div>
                      <p className="text-sm text-zinc-300 leading-relaxed italic">"{q.text}"</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                      {q.storyteller.avatarUrl ? (
                        <img src={q.storyteller.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-eucalyptus-400/10 flex items-center justify-center text-eucalyptus-400 text-xs font-bold">
                          {q.storyteller.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-zinc-300">{q.storyteller.name}</p>
                        {q.storyteller.location && <p className="text-[10px] text-zinc-600">{q.storyteller.location}</p>}
                      </div>
                      {q.theme && (
                        <span className="ml-auto text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded border border-white/[0.08] text-zinc-500">
                          {q.theme}
                        </span>
                      )}
                    </div>
                  </Glass>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Glass key={i} className="p-6 h-48 animate-pulse">
                  <div className="h-4 bg-white/[0.04] rounded w-3/4 mb-3" />
                  <div className="h-4 bg-white/[0.04] rounded w-full mb-2" />
                  <div className="h-4 bg-white/[0.04] rounded w-5/6" />
                </Glass>
              ))}
            </div>
          )}

          {stories.length > 0 && (
            <div className="mt-12">
              <Reveal>
                <h3 className="text-xl font-medium tracking-tight mb-6">Stories</h3>
              </Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stories.slice(0, 6).map((s, i) => (
                  <Reveal key={s.id} delay={i * 0.05}>
                    <Glass className="p-6 group" hover>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-semibold text-white leading-snug pr-4">{s.title}</h4>
                        <span className="text-zinc-600 group-hover:text-eucalyptus-400 transition-colors shrink-0">{Icon.arrow}</span>
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mb-4">{s.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">{s.authorName}</span>
                        <div className="flex gap-1.5">
                          {s.themes?.slice(0, 2).map((t, idx) => (
                            <span key={`${s.id}-theme-${idx}-${t}`} className="text-[9px] font-bold tracking-[0.1em] uppercase text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                    </Glass>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Journeys ─────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">Journey Maps</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-4">Through Their Eyes</h2>
            <p className="text-base text-zinc-500 font-light mb-12">
              The names are fictional. The systems are real.
            </p>
          </Reveal>
          <div className="space-y-3">
            {JOURNEYS.map((j, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <JourneyCard j={j} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hub Model ────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">The Alternative</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-4">The Hub Model</h2>
            <p className="text-base text-zinc-500 font-light mb-12 max-w-xl">
              Instead of six siloed services, one hub on country, run by traditional owners with
              the cultural authority, the relationships, and the land.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <Glass className="p-6" hover>
                  <div className="w-8 h-8 rounded-lg bg-eucalyptus-400/10 flex items-center justify-center text-eucalyptus-400 text-sm font-bold mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
                </Glass>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Economics ─────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">The Business Case</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-12">The Economics</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <Glass className="p-6">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-4">Hub Cost</p>
                <div className="text-4xl font-medium tracking-tight mb-1">$3.2M<span className="text-base text-zinc-600 ml-1">/year</span></div>
                <div className="h-px bg-white/[0.06] my-5" />
                <ul className="space-y-3 text-sm">
                  {[
                    ['Elder/Mentor Team (6)', '$600K'], ['Youth Workers (4)', '$400K'], ['NDIS Navigation (2)', '$250K'],
                    ['Transport (150km)', '$300K'], ['On-Country Programs', '$400K'], ['Facilities (Atnarpa)', '$500K'],
                    ['Admin + Digital', '$550K'], ['Contingency', '$200K'],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="text-zinc-300 tabular-nums font-medium">{v}</span></li>
                  ))}
                </ul>
                <p className="text-[10px] text-zinc-700 mt-5 pt-4 border-t border-white/[0.06]">Capital Year 1: $3M: Atnarpa, housing, vehicles, comms</p>
              </Glass>
            </Reveal>

            <Reveal delay={0.1}>
              <Glass className="p-6">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-4">Estimated Return</p>
                <div className="text-4xl font-medium tracking-tight text-eucalyptus-400 mb-1">$31.75M<span className="text-base text-zinc-600 ml-1">/year</span></div>
                <div className="h-px bg-white/[0.06] my-5" />
                <ul className="space-y-3 text-sm">
                  {[
                    ['Detention diversions (10)', '$14.6M'], ['School retention (20)', '$6M'], ['Reduced re-offending (10)', '$5M'],
                    ['NDIS utilisation (200)', '$3.9M'], ['Placement avoidance (15)', '$2.25M'],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="text-eucalyptus-400 tabular-nums font-medium">{v}</span></li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-xl text-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
                  <span className="text-3xl font-medium text-eucalyptus-400">~10:1</span>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-eucalyptus-400/60 mt-1">Return on Investment</p>
                </div>
              </Glass>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-center text-xs text-zinc-700 mt-6">Capital cost of $3M is less than one month of Don Dale operations.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Strategy ─────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400 mb-3">Roadmap</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-4">The Path Forward</h2>
            <p className="text-base text-zinc-500 font-light mb-12">From evidence to funded proposal in 12 weeks.</p>
          </Reveal>

          <div className="space-y-0">
            {PHASES.map((p) => (
              <Reveal key={p.n} delay={p.n * 0.05}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${
                      p.n === 1 ? 'bg-eucalyptus-400 border-eucalyptus-400 text-black' : 'border-zinc-800 text-zinc-500'
                    }`}>{p.n}</div>
                    {p.n < PHASES.length && <div className="w-px flex-1 bg-zinc-800 my-1" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-eucalyptus-400/60 bg-eucalyptus-400/[0.08] px-2 py-0.5 rounded">{p.time}</span>
                    </div>
                    <ul className="space-y-1">
                      {p.items.map((item, i) => (
                        <li key={i} className="text-sm text-zinc-500 flex items-start gap-2">
                          <span className="text-zinc-700 mt-0.5">&mdash;</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Line ──────────────────────────────────────── */}
      <section className="px-6 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-medium tracking-[-0.03em] mb-10">The Bottom Line</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 text-lg text-zinc-400 font-light leading-relaxed">
              <p>The government spends <span className="text-sunset-400 font-medium">$97 million per year</span> locking up Aboriginal children in the Northern Territory.</p>
              <p>Oonchiumpa keeps young people connected to culture, in school, and out of trouble with <span className="text-eucalyptus-400 font-medium">~$3M per year</span>.</p>
              <p>There are <span className="text-white font-medium">1,345 NDIS participants</span> in Central Australia with $238M in committed support. <span className="text-sunset-400">$50 million per year goes unspent.</span></p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-px bg-zinc-800 my-10 max-w-xs mx-auto" />
            <p className="text-xl md:text-2xl text-white font-medium leading-snug max-w-lg mx-auto">
              The young people of Central Australia deserve better than a system that spends $4,000 a day to lock them up and starves the organisations that actually keep them connected.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-eucalyptus-400 text-2xl md:text-3xl font-medium tracking-[-0.02em] mt-10">
              It's time for The Oonchiumpa Way.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-12 text-[10px] tracking-[0.25em] uppercase text-zinc-700">
              Data sourced from CivicGraph: NDIS Dec 2025, ROGS, AusTender, NIAA, ALMA
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default YouthHubPage;
