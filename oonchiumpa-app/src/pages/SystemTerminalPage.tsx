import React, { useState, useEffect, useRef } from 'react';

// ── Empathy Ledger API ──────────────────────────────────────────────────

const EMPATHY_API = 'https://empathy-ledger-v2.vercel.app/api/v1/content-hub';
const PROJECT = 'oonchiumpa';

interface Quote { text: string; theme: string; category: string; impactScore: number; storyteller: { id: string; name: string; avatarUrl: string | null; location: string | null; culturalBackground: string[] | null } }
interface Storyteller { id: string; displayName: string; bio: string; avatarUrl: string | null; location: string | null; elderStatus: boolean; themes: string[]; quotes: { text: string; context: string; impactScore: number }[] }

async function fetchQuotes(): Promise<Quote[]> {
  try { const r = await fetch(`${EMPATHY_API}/quotes?limit=20&min_impact=4&project=${PROJECT}`); if (!r.ok) return []; return (await r.json()).quotes || []; } catch { return []; }
}
async function fetchStorytellers(): Promise<Storyteller[]> {
  try { const r = await fetch(`${EMPATHY_API}/storytellers?limit=20&project=${PROJECT}`); if (!r.ok) return []; return (await r.json()).storytellers || []; } catch { return []; }
}

// ── Icons ───────────────────────────────────────────────────────────────

const I = {
  chevron: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  quote: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" opacity={0.25}><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" /></svg>,
  pulse: <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eucalyptus-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-eucalyptus-400" /></span>,
};

// ── Grain ───────────────────────────────────────────────────────────────

const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`;

// ── NT Data ─────────────────────────────────────────────────────────────

const TFHC_TOTAL = 3_160_000_000;
const YOUTH_JUSTICE_TOTAL = 972_457_000;
const DETENTION_TOTAL = 530_369_000;
const COMMUNITY_TOTAL = 351_950_000;
const CONFERENCING_TOTAL = 90_136_000;
const DETENTION_CAPITAL = 138_660_000;
const DON_DALE_REPLACEMENT = 55_000_000;
const DETENTION_COST_PER_DAY = 4_000;
const PCT_ABORIGINAL = 98;

const TOP_SUPPLIERS = [
  { name: 'Life Without Barriers', total: 106_400_000, contracts: 13, note: 'Residential care. Sydney-based NGO' },
  { name: 'Northern Rise Village Services', total: 24_000_000, contracts: 1, note: 'Quarantine accommodation' },
  { name: 'Saltbush Social Enterprises', total: 25_290_000, contracts: 2, note: 'Youth justice facilities, bail services' },
  { name: 'First Step Development', total: 10_100_000, contracts: 1, note: 'Supported accommodation' },
  { name: 'Wilson Security', total: 5_836_000, contracts: 1, note: 'Security at quarantine facility' },
  { name: 'Australian Childhood Foundation', total: 5_144_000, contracts: 3, note: 'Back on Track program, training' },
  { name: 'Mercure Alice Springs Resort', total: 4_173_000, contracts: 2, note: 'COVID hotspot accommodation' },
  { name: 'SAL Consulting', total: 3_667_000, contracts: 1, note: 'Medical/allied health panel' },
  { name: 'Jesuit Social Services', total: 3_340_000, contracts: 2, note: 'Restorative conferencing' },
  { name: 'Community Staffing Solutions', total: 3_592_000, contracts: 11, note: 'Labour hire' },
];

const NDIS_CENTRAL = { participants: 1_345, avgBudget: 177_000, committed: 238_000_000, utilisation: 79, youthParticipants: 637, youthWasted: 23_500_000 };

const COMMUNITY_ORGS = [
  // Community-controlled with significant funding
  { name: 'Tangentyere Council (all entities)', total: 35_800_000, source: 'NIAA ($11.1M) + Contracts ($24.7M)', community: true, sector: 'Town camps, housing, construction, youth hubs' },
  { name: 'Ingkerreke Commercial', total: 29_600_000, source: 'NT Housing + Infrastructure contracts', community: true, sector: 'Housing, outstations, construction' },
  { name: 'CAAC (Congress)', total: 4_800_000, source: 'NIAA ($2.8M) + Health contracts ($2M)', community: true, sector: 'Health, wellbeing, primary care' },
  { name: 'Bushmob Aboriginal Corporation', total: 4_700_000, source: 'NIAA Safety & Wellbeing', community: true, sector: 'Bush adventure therapy, youth programs' },
  { name: 'Oonchiumpa', total: 3_000_000, source: 'NIAA (unconfirmed) + Federal Court ($35K)', community: true, sector: 'Cultural brokerage, youth mentorship, True Justice' },
  { name: 'NPY Women\'s Council', total: 2_250_000, source: 'Dept Health + NIAA', community: true, sector: 'Women\'s services, cross-border, DV' },
  { name: 'NAAJA', total: 2_130_000, source: 'NIAA ($2.1M) + NT Health ($67K)', community: true, sector: 'Legal advocacy, youth justice, diversion' },
  { name: 'ASYASS', total: 1_225_000, source: 'NIAA Children & Schooling', community: true, sector: 'Youth accommodation, homelessness' },
  // Community-controlled with little or no visible federal funding
  { name: 'Gap Youth Centre', total: 0, source: 'No federal funding found', community: true, sector: 'Drop-in, safe space, prevention' },
  { name: 'Children\'s Ground', total: 0, source: 'No federal funding found', community: true, sector: '25-year whole-of-community, early years' },
  { name: 'CASSE', total: 0, source: 'No federal funding found', community: true, sector: 'Child safety, safe environments' },
  { name: 'Arid Lands Environment Centre', total: 500_000, source: 'NT Infrastructure contracts', community: false, sector: 'Environment, sustainability' },
  { name: 'Akeyulerre', total: 0, source: 'No federal funding found', community: true, sector: 'Healing, traditional medicine, cultural knowledge' },
  { name: 'Lhere Artepe', total: 0, source: 'No federal funding found', community: true, sector: 'Native title, traditional owners, land' },
];

const ALMA_INTERVENTIONS = [
  { name: 'Oonchiumpa Cultural Brokerage', type: 'Community-Led', linked: true },
  { name: 'Oonchiumpa Youth Mentorship', type: 'Wraparound', linked: true },
  { name: 'True Justice: Deep Listening', type: 'Cultural Connection', linked: true },
  { name: 'Atnarpa On-Country Programs', type: 'Cultural Connection', linked: true },
  { name: 'Building Self-Reliance', type: 'Cultural Connection', linked: false },
  { name: 'Alice Springs Youth Diversion', type: 'Diversion', linked: false },
  { name: 'NAAJA Youth Justice Advocacy', type: 'Diversion', linked: true },
  { name: 'CASSE Safe Environment', type: 'Early Intervention', linked: true },
  { name: "Children's Ground", type: 'Early Intervention', linked: true },
  { name: 'Trauma Informed Care', type: 'Early Intervention', linked: false },
  { name: 'Night Patrol', type: 'Prevention', linked: false },
  { name: 'Gap Youth Drop-In', type: 'Prevention', linked: true },
  { name: 'Tangentyere Town Camp Hubs', type: 'Prevention', linked: true },
  { name: 'Bushmob Adventure Therapy', type: 'Therapeutic', linked: true },
  { name: 'ASYASS Youth Accommodation', type: 'Wraparound', linked: true },
  { name: 'Youth Action Plan 2023-27', type: 'Community-Led', linked: false },
  { name: 'Reform Agenda (6 Priorities)', type: 'Community-Led', linked: false },
];

const ROGS_YOUTH_JUSTICE = [
  { year: '2014-15', detention: 41_598_000, community: 29_703_000 },
  { year: '2015-16', detention: 43_245_000, community: 29_922_000 },
  { year: '2016-17', detention: 55_785_000, community: 33_459_000 },
  { year: '2017-18', detention: 72_437_000, community: 37_695_000 },
  { year: '2018-19', detention: 63_920_000, community: 42_073_000 },
  { year: '2019-20', detention: 60_397_000, community: 39_277_000 },
  { year: '2020-21', detention: 52_100_000, community: 38_100_000 },
  { year: '2021-22', detention: 48_500_000, community: 35_400_000 },
  { year: '2022-23', detention: 46_800_000, community: 34_200_000 },
  { year: '2023-24', detention: 45_587_000, community: 32_121_000 },
];

// ── Helpers ─────────────────────────────────────────────────────────────

function $$(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function pct(n: number, total: number): string { return `${((n / total) * 100).toFixed(0)}%`; }

// ── Scroll animation ────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold });
    o.observe(el); return () => o.disconnect();
  }, [threshold]);
  return { ref, vis };
}

const Fade: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const { ref, vis } = useInView();
  return <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
};

// ── Theme ───────────────────────────────────────────────────────────────

const ThemeCtx = React.createContext<{ dark: boolean; toggle: () => void }>({ dark: true, toggle: () => {} });
const useTheme = () => React.useContext(ThemeCtx);

// ── Glass ───────────────────────────────────────────────────────────────

const G: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ children, className = '', hover = false }) => {
  const { dark } = useTheme();
  return (
    <div className={`rounded-2xl border ${dark ? 'border-white/[0.07]' : 'border-zinc-200'} ${hover ? `${dark ? 'hover:border-white/[0.14]' : 'hover:border-zinc-300'} hover:scale-[1.01] cursor-default` : ''} transition-all duration-300 ${className}`}
      style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>{children}</div>
  );
};

// ── Active Layer Tab ────────────────────────────────────────────────────

type Layer = 'money' | 'evidence' | 'voices' | 'alternative';

// ── Page ────────────────────────────────────────────────────────────────

const SystemTerminalInner: React.FC = () => {
  const [layer, setLayer] = useState<Layer>('money');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [storytellers, setStorytellers] = useState<Storyteller[]>([]);
  const [expandedSupplier, setExpandedSupplier] = useState<number | null>(null);
  const { dark, toggle } = useTheme();

  useEffect(() => { fetchQuotes().then(setQuotes); fetchStorytellers().then(setStorytellers); }, []);

  const maxSupplier = Math.max(...TOP_SUPPLIERS.map(s => s.total));
  const maxRogs = Math.max(...ROGS_YOUTH_JUSTICE.flatMap(r => [r.detention, r.community]));

  // Theme-aware text classes
  const t = {
    bg: dark ? 'bg-black' : 'bg-[#F4F4F5]',
    text: dark ? 'text-white' : 'text-zinc-900',
    muted: dark ? 'text-zinc-500' : 'text-zinc-500',
    subtle: dark ? 'text-zinc-600' : 'text-zinc-400',
    faint: dark ? 'text-zinc-700' : 'text-zinc-300',
    label: dark ? 'text-zinc-400' : 'text-zinc-600',
    heading: dark ? 'text-zinc-300' : 'text-zinc-800',
    body: dark ? 'text-zinc-500' : 'text-zinc-600',
    divider: dark ? 'border-white/[0.06]' : 'border-zinc-200',
    hoverRow: dark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50',
    barTrack: dark ? 'bg-white/[0.04]' : 'bg-zinc-200',
    tag: dark ? 'border-white/[0.08] text-zinc-500' : 'border-zinc-300 text-zinc-500',
    tagBg: dark ? 'bg-white/[0.04]' : 'bg-zinc-100',
  };

  const LAYER_LABELS: Record<Layer, string> = { money: 'The Money', evidence: 'The Evidence', voices: 'The Voices', alternative: 'The Alternative' };

  return (
    <div className={`${t.bg} ${t.text} font-['Inter',sans-serif] min-h-screen relative transition-colors duration-500`}>
      {dark && <div className="fixed inset-0 pointer-events-none z-50" style={{ backgroundImage: grain, opacity: 0.04 }} />}

      {/* ── Header ───────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-40 border-b ${t.divider}`}
        style={{ background: dark ? 'rgba(0,0,0,0.8)' : 'rgba(244,244,245,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {I.pulse}
            <span className={`text-[10px] font-bold tracking-[0.25em] uppercase ${t.label}`}>NT Youth System Terminal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(['money', 'evidence', 'voices', 'alternative'] as Layer[]).map(l => (
                <button key={l} onClick={() => setLayer(l)}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase rounded-lg transition-all ${
                    layer === l
                      ? 'bg-eucalyptus-400/10 text-eucalyptus-400 border border-eucalyptus-400/20'
                      : `${dark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-700'}`
                  }`}>{LAYER_LABELS[l]}</button>
              ))}
            </div>
            {/* Light/Dark toggle */}
            <button onClick={toggle} className={`p-2 rounded-lg border ${t.divider} ${t.hoverRow} transition-all`} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? (
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
              ) : (
                <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14">

        {/* ══════════════════════════════════════════════════════
           LAYER 1: THE MONEY
           ══════════════════════════════════════════════════════ */}
        {layer === 'money' && (
          <>
            {/* Hero numbers */}
            <section className="px-6 pt-24 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-4">Layer 1: The Money</p>
                  <h1 className="text-4xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] mb-4">
                    {$$(TFHC_TOTAL)} to Territory Families
                  </h1>
                  <p className="text-lg text-zinc-500 font-light max-w-2xl">
                    Every dollar the Northern Territory government spends on youth justice, child protection, and housing, and who gets it.
                  </p>
                </Fade>
              </div>
            </section>

            {/* Summary cards */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { v: $$(YOUTH_JUSTICE_TOTAL), l: 'Youth Justice Total', s: '10 years' },
                  { v: $$(DETENTION_TOTAL), l: 'Detention', s: pct(DETENTION_TOTAL, YOUTH_JUSTICE_TOTAL) + ' of total' },
                  { v: `$${DETENTION_COST_PER_DAY.toLocaleString()}`, l: 'Cost Per Day', s: 'Per child in detention' },
                  { v: `${PCT_ABORIGINAL}%`, l: 'Aboriginal', s: 'Of detained children' },
                  { v: $$(DON_DALE_REPLACEMENT), l: 'Don Dale Replacement', s: 'Capital expenditure' },
                ].map((c, i) => (
                  <Fade key={i} delay={i * 0.06}>
                    <G className="p-5" hover>
                      <div className="text-2xl md:text-3xl font-medium tracking-tight mb-1">{c.v}</div>
                      <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-0.5">{c.l}</div>
                      <div className="text-[10px] text-zinc-700">{c.s}</div>
                    </G>
                  </Fade>
                ))}
              </div>
            </section>

            {/* ROGS trend */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4">Youth Justice Spend Over Time</h3>
                  <G className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-sunset-500 inline-block" /> Detention</span>
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-500 flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-eucalyptus-500 inline-block" /> Community</span>
                    </div>
                    <div className="flex items-end gap-1 h-40">
                      {ROGS_YOUTH_JUSTICE.map((r, i) => (
                        <div key={i} className="flex-1 flex flex-col gap-0.5 items-center group">
                          <div className="w-full flex flex-col gap-0.5">
                            <div className="w-full rounded-t bg-sunset-500/80 transition-all" style={{ height: `${(r.detention / maxRogs) * 120}px` }} title={$$(r.detention)} />
                            <div className="w-full rounded-b bg-eucalyptus-500/60 transition-all" style={{ height: `${(r.community / maxRogs) * 120}px` }} title={$$(r.community)} />
                          </div>
                          <span className="text-[8px] text-zinc-700 mt-1 group-hover:text-zinc-400 transition-colors">{r.year.slice(2)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-700 mt-4">Detention peaked at $72M in 2017-18 (Royal Commission year). Still 55% of total spend.</p>
                  </G>
                </Fade>
              </div>
            </section>

            {/* Top suppliers */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">Who Gets the Money</h3>
                  <p className="text-xs text-zinc-600 mb-4">Territory Families contracts, top suppliers</p>
                </Fade>
                <G className="divide-y divide-white/[0.05]">
                  {TOP_SUPPLIERS.map((s, i) => (
                    <Fade key={i} delay={i * 0.03}>
                      <button onClick={() => setExpandedSupplier(expandedSupplier === i ? null : i)} className="w-full px-5 py-3 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
                        <div className="w-8 text-right text-xs tabular-nums text-zinc-600 font-medium">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-sm font-medium text-zinc-200 truncate">{s.name}</span>
                            <span className="text-sm tabular-nums text-zinc-400 font-medium ml-4">{$$(s.total)}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.04] rounded overflow-hidden">
                            <div className="h-full rounded bg-sunset-500/60" style={{ width: `${(s.total / maxSupplier) * 100}%` }} />
                          </div>
                          {expandedSupplier === i && (
                            <div className="mt-2 flex gap-3">
                              <span className="text-[10px] text-zinc-600">{s.contracts} contracts</span>
                              <span className="text-[10px] text-zinc-500">{s.note}</span>
                            </div>
                          )}
                        </div>
                        <span className={`text-zinc-700 transition-transform ${expandedSupplier === i ? 'rotate-180' : ''}`}>{I.chevron}</span>
                      </button>
                    </Fade>
                  ))}
                </G>
              </div>
            </section>

            {/* Community orgs comparison */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">Community-Controlled Organisations</h3>
                  <p className="text-xs text-zinc-600 mb-4">What Aboriginal community-controlled organisations receive</p>
                </Fade>
                <div className="grid md:grid-cols-2 gap-3">
                  {COMMUNITY_ORGS.map((o, i) => (
                    <Fade key={i} delay={i * 0.03}>
                      <G className="p-5" hover>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${o.total > 0 ? 'bg-eucalyptus-400' : 'bg-zinc-700'}`} />
                            <span className="text-sm font-medium text-zinc-200">{o.name}</span>
                          </div>
                          <span className={`text-lg font-medium tabular-nums ${o.total > 0 ? 'text-eucalyptus-400' : 'text-zinc-700'}`}>
                            {o.total > 0 ? $$(o.total) : 'Unfunded'}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mb-1">{o.sector}</p>
                        <span className="text-[10px] text-zinc-700">{o.source}</span>
                      </G>
                    </Fade>
                  ))}
                </div>
              </div>
            </section>

            {/* NDIS */}
            <section className="px-6 pb-24">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">NDIS in Central Australia</h3>
                  <p className="text-xs text-zinc-600 mb-4">December 2025, committed budgets vs actual utilisation</p>
                </Fade>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { v: NDIS_CENTRAL.participants.toLocaleString(), l: 'Participants', s: 'Alice Springs + MacDonnell + Central Desert + Barkly' },
                    { v: $$(NDIS_CENTRAL.committed), l: 'Committed', s: `Avg ${$$(NDIS_CENTRAL.avgBudget)} per participant` },
                    { v: `${NDIS_CENTRAL.utilisation}%`, l: 'Utilisation', s: '57% for children 0-8' },
                    { v: $$(NDIS_CENTRAL.youthWasted), l: 'Youth Budgets Wasted/yr', s: `${NDIS_CENTRAL.youthParticipants} young participants` },
                  ].map((c, i) => (
                    <Fade key={i} delay={i * 0.06}>
                      <G className="p-5" hover>
                        <div className="text-2xl font-medium tracking-tight text-amber-400 mb-1">{c.v}</div>
                        <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-0.5">{c.l}</div>
                        <div className="text-[10px] text-zinc-700">{c.s}</div>
                      </G>
                    </Fade>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ══════════════════════════════════════════════════════
           LAYER 2: THE EVIDENCE
           ══════════════════════════════════════════════════════ */}
        {layer === 'evidence' && (
          <section className="px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <Fade>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-4">Layer 2: The Evidence</p>
                <h2 className="text-4xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] mb-4">What Actually Works</h2>
                <p className="text-lg text-zinc-500 font-light max-w-2xl mb-12">
                  17 mapped interventions in Alice Springs from the Australian Living Map of Alternatives (ALMA). Ranked by evidence, linked to CivicGraph entities.
                </p>
              </Fade>

              <Fade>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {['All', 'Community-Led', 'Cultural Connection', 'Prevention', 'Diversion', 'Early Intervention', 'Wraparound', 'Therapeutic'].map(t => (
                    <span key={t} className="text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.15] transition-all cursor-default">{t}</span>
                  ))}
                </div>
              </Fade>

              <G className="divide-y divide-white/[0.05]">
                {ALMA_INTERVENTIONS.map((a, i) => (
                  <Fade key={i} delay={i * 0.02}>
                    <div className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className={`w-2 h-2 rounded-full ${a.linked ? 'bg-eucalyptus-400' : 'bg-zinc-700'}`} />
                      <span className="text-sm text-zinc-200 flex-1">{a.name}</span>
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded border border-white/[0.08] text-zinc-500">{a.type}</span>
                      {a.linked && <span className="text-[9px] text-eucalyptus-400/60">CivicGraph</span>}
                    </div>
                  </Fade>
                ))}
              </G>

              <Fade delay={0.2}>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <G className="p-5 text-center" hover>
                    <div className="text-3xl font-medium text-eucalyptus-400">17</div>
                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600 mt-1">Interventions</div>
                  </G>
                  <G className="p-5 text-center" hover>
                    <div className="text-3xl font-medium text-eucalyptus-400">11</div>
                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600 mt-1">Linked to CivicGraph</div>
                  </G>
                  <G className="p-5 text-center" hover>
                    <div className="text-3xl font-medium text-amber-400">67%</div>
                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600 mt-1">NTG Spend is Reactive</div>
                  </G>
                </div>
              </Fade>

              <Fade delay={0.3}>
                <div className="mt-8">
                  <G className="p-6">
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">The Funding Inversion</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                      The 2022 Youth Services Mapping Project found that <span className="text-sunset-400 font-medium">67% of NTG youth spend is reactive</span> ($14.77M)
                      and only <span className="text-eucalyptus-400 font-medium">9% goes to prevention</span> ($2.02M). The system is designed backwards.
                    </p>
                    <div className="flex gap-2 h-4 rounded overflow-hidden">
                      <div className="bg-sunset-500/70 rounded" style={{ width: '67%' }} title="Reactive 67%" />
                      <div className="bg-amber-500/70 rounded" style={{ width: '24%' }} title="Early intervention 24%" />
                      <div className="bg-eucalyptus-500/70 rounded" style={{ width: '9%' }} title="Prevention 9%" />
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-zinc-600">
                      <span>Reactive 67%</span>
                      <span>Early intervention 24%</span>
                      <span>Prevention 9%</span>
                    </div>
                  </G>
                </div>
              </Fade>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
           LAYER 3: THE VOICES
           ══════════════════════════════════════════════════════ */}
        {layer === 'voices' && (
          <section className="px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <Fade>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-4">Layer 3: The Voices</p>
                <h2 className="text-4xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] mb-4">From the Community</h2>
                <p className="text-lg text-zinc-500 font-light max-w-2xl mb-12">
                  Real voices from Oonchiumpa's community: elders, young people, and partners. Sourced from the Empathy Ledger.
                </p>
              </Fade>

              {/* Storytellers */}
              {storytellers.length > 0 && (
                <Fade>
                  <div className="mb-12">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">Storytellers</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {storytellers.map((s, i) => (
                        <Fade key={s.id} delay={i * 0.05}>
                          <G className="p-5 flex gap-4" hover>
                            {s.avatarUrl ? (
                              <img src={s.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-eucalyptus-400/10 flex items-center justify-center text-eucalyptus-400 font-bold shrink-0">
                                {s.displayName.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-zinc-200">{s.displayName}</div>
                              {s.location && <div className="text-[10px] text-zinc-600 truncate">{s.location}</div>}
                              {s.elderStatus && <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-400/70 mt-1 inline-block">Elder</span>}
                              {s.themes?.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {s.themes.slice(0, 3).map(t => (
                                    <span key={t} className="text-[8px] font-bold tracking-[0.1em] uppercase text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded">{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </G>
                        </Fade>
                      ))}
                    </div>
                  </div>
                </Fade>
              )}

              {/* Quotes */}
              {quotes.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {quotes.slice(0, 12).map((q, i) => (
                    <Fade key={i} delay={i * 0.04}>
                      <G className="p-6" hover>
                        <div className="text-eucalyptus-400/20 mb-3">{I.quote}</div>
                        <p className="text-sm text-zinc-300 leading-relaxed italic mb-4">"{q.text}"</p>
                        <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                          {q.storyteller.avatarUrl ? (
                            <img src={q.storyteller.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-eucalyptus-400/10 flex items-center justify-center text-eucalyptus-400 text-[10px] font-bold">
                              {q.storyteller.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-medium text-zinc-400">{q.storyteller.name}</p>
                            {q.storyteller.location && <p className="text-[10px] text-zinc-700">{q.storyteller.location}</p>}
                          </div>
                        </div>
                      </G>
                    </Fade>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <G key={i} className="p-6 h-44 animate-pulse"><div className="h-3 bg-white/[0.04] rounded w-3/4 mb-3" /><div className="h-3 bg-white/[0.04] rounded w-full mb-2" /><div className="h-3 bg-white/[0.04] rounded w-5/6" /></G>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
           LAYER 4: THE ALTERNATIVE
           ══════════════════════════════════════════════════════ */}
        {layer === 'alternative' && (
          <>
            {/* Hero comparison, visceral */}
            <section className="px-6 pt-24 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-4">Layer 4: The Alternative</p>
                  <h2 className="text-4xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] mb-6">The Oonchiumpa Way</h2>
                </Fade>

                {/* The brutal comparison */}
                <Fade delay={0.1}>
                  <div className="grid md:grid-cols-2 gap-0 mb-16 rounded-2xl overflow-hidden border border-white/[0.07]">
                    {/* What the system buys */}
                    <div className="p-8 md:p-10" style={{ background: 'rgba(239,68,68,0.04)' }}>
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sunset-400/60 mb-6">What $4,000/day buys</p>
                      <ul className="space-y-4">
                        {[
                          'A locked cell in a facility built for adults',
                          'Guards who rotate every 8 hours',
                          'A caseworker who\'s never been to their country',
                          'Five intake forms in five systems that don\'t talk',
                          'A cultural awareness module that doesn\'t work',
                          'A 60% chance they\'ll be back within 12 months',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-sunset-400/40 mt-1 text-xs">x</span>
                            <span className="text-sm text-zinc-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-sunset-400/10">
                        <div className="text-3xl font-medium text-sunset-400">$1.46M</div>
                        <p className="text-[10px] text-zinc-600 mt-1">per child per year in detention</p>
                      </div>
                    </div>

                    {/* What Oonchiumpa builds */}
                    <div className="p-8 md:p-10" style={{ background: 'rgba(52,211,153,0.04)' }}>
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400/60 mb-6">What the hub builds</p>
                      <ul className="space-y-4">
                        {[
                          'An elder who knows their grandmother\'s law name',
                          'On-country healing at Atnarpa Homestead',
                          'NDIS plan navigation that gets $50M of unspent budgets flowing',
                          'One relationship that predates the crisis and outlasts it',
                          'True Justice, judges and elders in deep listening circles',
                          '90% retention. 95% school re-engagement. Proven.',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-eucalyptus-400 mt-1 text-xs">+</span>
                            <span className="text-sm text-zinc-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-eucalyptus-400/10">
                        <div className="text-3xl font-medium text-eucalyptus-400">~$3M</div>
                        <p className="text-[10px] text-zinc-600 mt-1">per year for the whole hub: 7 language groups, 150km radius</p>
                      </div>
                    </div>
                  </div>
                </Fade>

                {/* What it costs to do nothing */}
                <Fade delay={0.2}>
                  <G className="p-8 mb-16">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-6">The Cost of Doing Nothing</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { v: '$4,000', l: 'Per Day', s: 'Detention', c: 'text-sunset-400' },
                        { v: '$1.46M', l: 'Per Year', s: 'Per detained child', c: 'text-sunset-400' },
                        { v: '$23.5M', l: 'Wasted/Year', s: 'NDIS youth budgets unspent', c: 'text-amber-400' },
                        { v: '60%', l: 'Return Rate', s: 'Back in detention within a year', c: 'text-sunset-400' },
                        { v: '$55M', l: 'Don Dale II', s: 'Building another one', c: 'text-sunset-400' },
                      ].map((c, i) => (
                        <div key={i} className="text-center">
                          <div className={`text-2xl md:text-3xl font-medium ${c.c}`}>{c.v}</div>
                          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500 mt-1">{c.l}</div>
                          <div className="text-[10px] text-zinc-700 mt-0.5">{c.s}</div>
                        </div>
                      ))}
                    </div>
                  </G>
                </Fade>
              </div>
            </section>

            {/* The Human Cost */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/60 mb-3">Beyond the Dollar</p>
                  <h3 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] mb-4">The Human Cost</h3>
                  <p className="text-base text-zinc-500 font-light max-w-2xl mb-10">
                    Money measures the system's failure. But the real cost is measured in lives, families, and generations.
                  </p>
                </Fade>

                {/* The young person */}
                <Fade>
                  <G className="p-8 mb-4">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sunset-400/50 mb-5">What Detention Does to a Young Person</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <ul className="space-y-4">
                        {[
                          { stat: '65%', text: 'of detained youth have a cognitive disability or mental health condition: undiagnosed, unmanaged, made worse by incarceration' },
                          { stat: '8.2%', text: 'youth homelessness rate in the NT, 14x the national average. Detention doesn\'t give them a home. It gives them a record.' },
                          { stat: '80%', text: 'of young people in detention have experienced abuse, neglect, or family violence. The system punishes the symptoms of its own failures.' },
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="text-xl font-medium text-sunset-400 shrink-0 w-12 text-right">{item.stat}</span>
                            <span className="text-sm text-zinc-400 leading-relaxed">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-4">
                        {[
                          { stat: '26x', text: 'more likely to end up in adult prison. Detention doesn\'t divert, it\'s a pipeline. It teaches kids that they belong in cages.' },
                          { stat: '17 yrs', text: 'less life expectancy for Indigenous Australians. Every year in the system accelerates this. Connection to culture is a protective factor against early death.' },
                          { stat: '0', text: 'services that speak their language. Five systems, five case files, five intake forms: none in Arrernte, Luritja, Warlpiri, Pitjantjatjara, Alyawarre, Anmatyerre, or Kaytetye.' },
                        ].map((item, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="text-xl font-medium text-sunset-400 shrink-0 w-12 text-right">{item.stat}</span>
                            <span className="text-sm text-zinc-400 leading-relaxed">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </G>
                </Fade>

                {/* Family & intergenerational */}
                <Fade delay={0.1}>
                  <G className="p-8 mb-4">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400/50 mb-5">What It Does to Families</p>
                    <div className="space-y-4">
                      {[
                        'When a child is removed: to detention, to out-of-home care, to a placement 1,500km from their homeland, the whole family system fractures. Grandmothers carry the grief. Siblings lose their protector. Parents lose purpose.',
                        'In Central Australia, 172 NDIS participants live in MacDonnell Shire, 200km from Alice Springs. When their kids are removed to town, the family\'s NDIS supports collapse. The plan was built around a family unit that no longer exists. Utilisation drops to 30%.',
                        'The Stolen Generations didn\'t end. The NT has the highest child removal rate in Australia. The same families who had children taken in the 1960s are having grandchildren taken now: by the same system, under different legislation, with the same outcomes.',
                        'Every child removed from country is a language speaker lost. Of Oonchiumpa\'s 7 language groups, several are critically endangered. When young people are disconnected from elders, the transmission chain breaks. You can\'t fund language revitalisation programs for a language that has no young speakers left.',
                      ].map((text, i) => (
                        <p key={i} className="text-sm text-zinc-400 leading-relaxed pl-4 border-l-2 border-amber-400/20">{text}</p>
                      ))}
                    </div>
                  </G>
                </Fade>

                {/* Regional & long-term health */}
                <Fade delay={0.2}>
                  <G className="p-8 mb-4">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400/50 mb-5">Long-Term Health of the Region</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-2">Mental Health</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          Youth suicide rates in remote NT are among the highest in the world. Disconnection from culture, country, and family is the primary risk factor.
                          Every evidence review names cultural connection as the strongest protective factor, yet the system systematically severs it.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-2">Physical Health</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          86 people in Central Australia have acquired brain injury (ABI), average NDIS plan $467K. Many of those injuries were acquired through
                          violence, incarceration, and neglect. The system creates the disability, then underfunds the support.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-2">Community Safety</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          When young people are disconnected and cycling through detention, community safety deteriorates for everyone.
                          The Night Patrol picks up kids at 2am because there's nowhere else. The hub model doesn't just help the young person, it makes the whole community safer.
                        </p>
                      </div>
                    </div>
                  </G>
                </Fade>

                {/* What connection looks like */}
                <Fade delay={0.3}>
                  <G className="p-8 mb-16">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400/50 mb-5">What Connection Looks Like</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          When a young person sits with an elder on country at Atnarpa Homestead, hearing stories in their own language, learning about their responsibility to land and family, that's not a "cultural program". That's identity formation. That's the foundation everything else is built on.
                        </p>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          True Justice brings judges to country. They sit in circle with elders and young people. They listen. The judge sees the child as a whole person, connected to a 60,000-year culture, not a case number. This changes sentencing. It changes outcomes. It changes lives.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          When Oonchiumpa navigates a family's NDIS plans: mum's disability, the baby's developmental delay, grandmother's support needs, they're not just improving utilisation statistics.
                          They're keeping a family together. They're making sure a 17-year-old mother has the support to raise her child on country, connected to the women who will teach her.
                        </p>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          The 90% retention rate isn't a KPI. It means 9 out of 10 young people <span className="text-eucalyptus-400 font-medium">chose to stay</span>. In a system where every other service has revolving doors, that number is the proof. Young people stay when they feel safe, seen, and connected to who they are.
                        </p>
                      </div>
                    </div>
                  </G>
                </Fade>
              </div>
            </section>

            {/* Economics */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <Fade>
                    <G className="p-6">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-4">Hub Operating Budget</p>
                      <div className="text-4xl font-medium tracking-tight mb-1">$3.2M<span className="text-base text-zinc-600 ml-1">/year</span></div>
                      <div className="h-px bg-white/[0.06] my-5" />
                      <ul className="space-y-3 text-sm">
                        {[['Elder/Mentor Team (6)', '$600K'], ['Youth Workers (4)', '$400K'], ['NDIS Navigation (2)', '$250K'], ['Transport (150km)', '$300K'], ['On-Country Programs', '$400K'], ['Facilities (Atnarpa)', '$500K'], ['Admin + Digital', '$550K'], ['Contingency', '$200K']].map(([k, v]) => (
                          <li key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="text-zinc-300 tabular-nums font-medium">{v}</span></li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-white/[0.06]">
                        <p className="text-[10px] text-zinc-600">Capital Year 1: $3M, less than 1 month of Don Dale operations</p>
                      </div>
                    </G>
                  </Fade>
                  <Fade delay={0.1}>
                    <G className="p-6">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-4">Estimated System Savings</p>
                      <div className="text-4xl font-medium tracking-tight text-eucalyptus-400 mb-1">$31.75M<span className="text-base text-zinc-600 ml-1">/year</span></div>
                      <div className="h-px bg-white/[0.06] my-5" />
                      <ul className="space-y-3 text-sm">
                        {[['Detention diversions (10 kids)', '$14.6M'], ['School retention (20 kids)', '$6M'], ['Reduced re-offending (10)', '$5M'], ['NDIS utilisation unlocked (200)', '$3.9M'], ['Placement avoidance (15)', '$2.25M']].map(([k, v]) => (
                          <li key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="text-eucalyptus-400 tabular-nums font-medium">{v}</span></li>
                        ))}
                      </ul>
                      <div className="mt-5 p-4 rounded-xl text-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
                        <span className="text-3xl font-medium text-eucalyptus-400">~10:1</span>
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-eucalyptus-400/50 mt-1">Return on Investment</p>
                      </div>
                    </G>
                  </Fade>
                </div>

                {/* What they could buy instead */}
                <Fade>
                  <G className="p-8 mb-16">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-2">What $106M to Life Without Barriers Could Have Built Instead</h3>
                    <p className="text-xs text-zinc-600 mb-6">That's what one Sydney-based NGO received from Territory Families. Here's what it could fund:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { v: '33', l: 'Oonchiumpa Hubs', s: 'At $3.2M/year each' },
                        { v: '72', l: 'Years of Operation', s: 'For the Alice Springs hub' },
                        { v: '730', l: 'Kids Diverted', s: 'From detention, per year' },
                        { v: '$1.07B', l: 'System Savings', s: 'If all 33 hubs ran for 1 year' },
                      ].map((c, i) => (
                        <div key={i} className="text-center p-4 rounded-xl" style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.08)' }}>
                          <div className="text-2xl font-medium text-eucalyptus-400">{c.v}</div>
                          <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500 mt-1">{c.l}</div>
                          <div className="text-[10px] text-zinc-700 mt-0.5">{c.s}</div>
                        </div>
                      ))}
                    </div>
                  </G>
                </Fade>
              </div>
            </section>

            {/* What Oonchiumpa already delivers */}
            <section className="px-6 pb-16">
              <div className="max-w-6xl mx-auto">
                <Fade>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-1">Proven Track Record</h3>
                  <p className="text-xs text-zinc-600 mb-4">What Oonchiumpa already delivers with current funding</p>
                </Fade>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
                  {[
                    { v: '90%', l: 'Retention Rate', accent: 'text-eucalyptus-400' },
                    { v: '95%', l: 'School Re-engagement', accent: 'text-eucalyptus-400' },
                    { v: '7', l: 'Language Groups Served', accent: 'text-amber-400' },
                    { v: '150km', l: 'Service Radius', accent: 'text-amber-400' },
                    { v: '32+', l: 'Partner Organisations', accent: 'text-eucalyptus-400' },
                    { v: '21', l: 'Youth Engaged (ASR)', accent: 'text-eucalyptus-400' },
                    { v: '2022', l: 'True Justice (with ANU)', accent: 'text-amber-400' },
                    { v: '5', l: 'Active Programs', accent: 'text-eucalyptus-400' },
                  ].map((s, i) => (
                    <Fade key={i} delay={i * 0.04}>
                      <G className="p-5 text-center" hover>
                        <div className={`text-2xl font-medium ${s.accent}`}>{s.v}</div>
                        <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-600 mt-1">{s.l}</div>
                      </G>
                    </Fade>
                  ))}
                </div>

                {/* The land */}
                <Fade>
                  <G className="p-8 mb-16">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">The Land Advantage</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                      Oonchiumpa are traditional owners. They have land. Atnarpa Homestead and connections across Arrernte country.
                      This is not a service that needs to rent office space. This is a model that operates <span className="text-white font-medium">on country, from country, with the authority of traditional ownership</span>.
                    </p>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      No other organisation in the Alice Springs youth services ecosystem has this. Not Life Without Barriers ($106M, based in Sydney).
                      Not Saltbush ($25M). Not Jesuit Social Services ($3.3M, based in Melbourne). The traditional owners have the land, the relationships,
                      the cultural authority, and the outcomes. What they don't have is the infrastructure funding.
                    </p>
                    <div className="mt-6 grid grid-cols-4 gap-3">
                      {[
                        { v: 'Atnarpa', l: 'Homestead on Country' },
                        { v: 'Arrernte', l: 'Traditional Authority' },
                        { v: '$3M', l: 'Capital Needed' },
                        { v: '< 1 month', l: 'Of Don Dale Ops' },
                      ].map((c, i) => (
                        <div key={i} className="text-center p-3 rounded-lg" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}>
                          <div className="text-sm font-medium text-amber-400">{c.v}</div>
                          <div className="text-[8px] font-bold tracking-[0.15em] uppercase text-zinc-600 mt-0.5">{c.l}</div>
                        </div>
                      ))}
                    </div>
                  </G>
                </Fade>
              </div>
            </section>

            {/* Bottom line */}
            <section className="px-6 pb-32">
              <div className="max-w-3xl mx-auto">
                <Fade>
                  <div className="text-center">
                    <div className="h-px bg-zinc-800 max-w-xs mx-auto mb-12" />

                    <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-bold mb-8">The question isn't whether we can afford the hub</p>

                    <p className="text-2xl md:text-3xl text-zinc-200 font-light leading-relaxed mb-4">
                      It costs <span className="text-sunset-400 font-medium">$1.46 million per year</span> to lock up one Aboriginal child.
                    </p>
                    <p className="text-2xl md:text-3xl text-zinc-200 font-light leading-relaxed mb-4">
                      It costs <span className="text-eucalyptus-400 font-medium">$3.2 million per year</span> to keep dozens connected to culture, country, and school.
                    </p>
                    <p className="text-2xl md:text-3xl text-zinc-200 font-light leading-relaxed mb-12">
                      <span className="text-white font-medium">98%</span> of the children in NT detention are Aboriginal.
                    </p>

                    <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-bold mb-8">The question is whether we can afford not to</p>

                    <p className="text-eucalyptus-400 text-3xl md:text-4xl font-medium tracking-[-0.02em] mt-4">
                      It's time for The Oonchiumpa Way.
                    </p>

                    <p className="mt-12 text-[10px] tracking-[0.25em] uppercase text-zinc-700">
                      Data: CivicGraph + NDIS Dec 2025 + ROGS + AusTender + NIAA + ALMA
                    </p>
                  </div>
                </Fade>
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
};

const SystemTerminalPage: React.FC = () => {
  const [dark, setDark] = useState(true);
  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <SystemTerminalInner />
    </ThemeCtx.Provider>
  );
};

export default SystemTerminalPage;
