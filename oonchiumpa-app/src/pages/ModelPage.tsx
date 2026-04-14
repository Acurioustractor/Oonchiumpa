import React, { useState } from 'react';

/*
  THE OONCHIUMPA MODEL

  Grounded in the Aboriginal Social & Emotional Wellbeing (SEWB) framework
  and the ARACY Nest (used in the Mparntwe Youth Action Plan 2023-27).

  The current system works OUTSIDE-IN: departments → programs → the child.
  Oonchiumpa works INSIDE-OUT: identity → culture → family → community → services.

  Visual: concentric circles radiating from the young person at the centre.
  Each ring is a layer of support. The deeper the ring, the more foundational.

  This is not a service model. It's a way of being.
*/

// ── Grain ───────────────────────────────────────────────────────────────
const grain = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`;

// ── Model Layers ────────────────────────────────────────────────────────

interface ModelLayer {
  id: string;
  name: string;
  arrernte?: string;
  color: string;
  radius: number;
  description: string;
  elements: { name: string; detail: string }[];
  systemComparison: string;
  voice?: { quote: string; who: string; role: string; avatar?: string };
}

const LAYERS: ModelLayer[] = [
  {
    id: 'self',
    name: 'The Young Person',
    arrernte: 'Apmere-kenhe',
    color: '#fbbf24',
    radius: 60,
    description: 'At the centre is the whole young person — not a case number, not a diagnosis, not a risk score. A person with identity, dreams, language, and belonging. Everything radiates from here.',
    elements: [
      { name: 'Identity', detail: 'Who they are — their skin name, their country, their dreaming. This comes before any service plan.' },
      { name: 'Voice', detail: 'What they want, not what the system thinks they need. The hub asks first, always.' },
      { name: 'Strength', detail: 'What they bring — knowledge, resilience, humour, connection. Not just deficits.' },
      { name: 'Safety', detail: 'Physical, emotional, and cultural safety. Feeling safe enough to be themselves.' },
    ],
    systemComparison: 'The current system starts here only as a case file — name, DOB, risk level, referral source. Five systems create five separate versions of the same child, none of them complete.',
    voice: { quote: 'J and A were always grumpy, not wanting to do anything. But now they are just happy, they are laughing in the car with us, dancing, giggling. Before they were heavy and had a lot of worries — now they are free to be themselves.', who: 'Oonchiumpa staff member', role: 'On young people in the program' },
  },
  {
    id: 'culture',
    name: 'Culture & Country',
    arrernte: 'Apmere Altyerre-kenhe',
    color: '#f59e0b',
    radius: 120,
    description: 'The first ring is culture — language, law, ceremony, and connection to country. In the SEWB framework, this is the foundation of all wellbeing. It\'s not an add-on or a program. It\'s the ground everything stands on.',
    elements: [
      { name: 'Language', detail: '7 language groups served: Arrernte, Luritja, Warlpiri, Pitjantjatjara, Alyawarre, Anmatyerre, Kaytetye. Language is identity.' },
      { name: 'Law & Ceremony', detail: 'Connection to traditional law, men\'s and women\'s business, seasonal ceremony. Elders guide what\'s appropriate.' },
      { name: 'Country', detail: 'Atnarpa Homestead. Homeland access. On-country camps. Bush tucker. The land heals.' },
      { name: 'Elders', detail: 'Senior lawwomen and lawmen as the authority. Not a cultural advisory committee — the actual holders of knowledge.' },
      { name: 'Story & Dreaming', detail: 'Connection to ancestral stories and creation narratives that give meaning, responsibility, and place.' },
      { name: 'Atnarpa Homestead', detail: 'Built 1933 from local rocks, clay from Loves Creek swamps, spinifex grass as binder — walls one metre thick. Bred horses for the British Army during WWII. Land claimed 1994, title returned 2012. This is Oonchiumpa\'s country.' },
    ],
    systemComparison: 'The system treats culture as a compliance checkbox — "cultural competency training" for rotating staff. 4 hours of online training vs 60,000 years of continuous culture.',
    voice: { quote: 'The heartache of our granny being a slave out on our own country... but also knowing that this is our great grandmother\'s country. We camped and we sang and we danced during that land claim in 1994.', who: 'Kristy Bloomfield', role: 'Oonchiumpa Co-founder, Traditional Owner', avatar: 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/kristy_bloomfield.jpg' },
  },
  {
    id: 'family',
    name: 'Family & Kinship',
    arrernte: 'Apmere Aknganentye',
    color: '#34d399',
    radius: 190,
    description: 'Family in Arrernte kinship is not nuclear — it\'s an intricate web of responsibility, obligation, and care that extends across clans, country, and generations. The hub works with the whole family system, not just the individual.',
    elements: [
      { name: 'Grandmothers & Grandfathers', detail: 'The primary holders of knowledge and law. Often the primary carers. Their NDIS plans, their health, their connection to grandchildren — all part of the same picture.' },
      { name: 'Parents', detail: 'Supporting parents who are often dealing with their own trauma, disability, housing instability. The hub supports them to support their children.' },
      { name: 'Siblings', detail: 'When one child is removed, siblings carry the loss. The hub keeps families together by preventing the removal.' },
      { name: 'Kinship Network', detail: 'Aunties, uncles, cousins — skin group relationships that define responsibility. The hub navigates this. The system doesn\'t know it exists.' },
      { name: 'NDIS Family Navigation', detail: 'Three NDIS plans in one family? The hub coordinates them as one. Mother, child, grandmother — one navigator, one relationship, not three separate providers.' },
    ],
    systemComparison: 'TFHC assesses whether the family is "safe" using frameworks designed for suburban nuclear families. When housing is inadequate on a homeland — because government hasn\'t funded infrastructure — the system calls it neglect.',
    voice: { quote: 'He didn\'t understand the importance of his cultural role before. He is now able to reflect on his actions and feeling remorse. He knows he can be a leader.', who: 'Oonchiumpa evaluation report', role: 'About CB, a young person in the program' },
  },
  {
    id: 'community',
    name: 'Community & Place',
    color: '#6ee7b7',
    radius: 260,
    description: 'The young person belongs to a place — a town camp, a homeland, a community. The hub is rooted in place. It doesn\'t operate from an office in town — it goes to where people are.',
    elements: [
      { name: 'Town Camps', detail: 'Alice Springs has 18 town camps, home to ~2,000 people. These are communities with governance, identity, and need. Tangentyere Council provides hubs. Oonchiumpa provides cultural connection.' },
      { name: 'Homelands', detail: '150km radius. Families living on country — MacDonnell, Central Desert, remote outstations. Services don\'t go there. Oonchiumpa does.' },
      { name: 'Schools', detail: 'The hub works with schools — not as a referral source, but as a partner. When Danny gets suspended, the elder is already there. 95% school re-engagement.' },
      { name: 'Safe Spaces', detail: 'Gap Youth Centre, Tangentyere hubs, Atnarpa Homestead — physical places where young people feel they belong. Not institutions. Homes.' },
      { name: 'Peer Connection', detail: 'Young people connected to other young people through culture, sport, on-country programs. Not isolation — belonging.' },
    ],
    systemComparison: 'Services are clustered in the Alice Springs CBD, open 9-5 weekdays. The Night Patrol picks up kids at 2am because that\'s when they\'re on the streets — but daytime services are closed.',
    voice: { quote: 'When a kid goes to school for a whole week, that\'s a little win for us. May not seem like a lot, but when you\'re talking about kids with these barriers, it is a good win for us.', who: 'Kristy Bloomfield', role: 'Oonchiumpa Co-founder', avatar: 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/kristy_bloomfield.jpg' },
  },
  {
    id: 'services',
    name: 'Services & Support',
    color: '#a78bfa',
    radius: 330,
    description: 'Services sit in the outer ring — not the centre. They support the young person, but they don\'t define them. The hub brokers access to services without letting them take over.',
    elements: [
      { name: 'NDIS Navigation', detail: 'Cultural brokerage between participants and providers. Pushing utilisation from 57% to 90%. $50M/year in committed budgets that aren\'t reaching people.' },
      { name: 'Health & Wellbeing', detail: 'CAAC, Bushmob bush adventure therapy, trauma-informed care — accessed through the hub, not cold referrals.' },
      { name: 'Legal & Justice', detail: 'NAAJA for legal advocacy. True Justice for on-country diversion. The judge already knows the elder. The elder already knows the child.' },
      { name: 'Housing', detail: 'ASYASS for crisis accommodation. But the real housing solution is on homeland — with infrastructure funding that doesn\'t exist yet.' },
      { name: 'Education', detail: 'School liaison, boarding support, transition. Not "attendance officers" — elders who walk with young people between two worlds.' },
      { name: 'Therapeutic', detail: 'Bushmob adventure therapy, trauma counselling, SEWB services — accessed when the young person is ready, through someone they trust.' },
    ],
    systemComparison: 'In the current model, services are the starting point. Referral → intake → assessment → case plan. The young person is processed. In the hub model, services are available when needed — but the relationship comes first.',
    voice: { quote: 'As a cultural broker — to link them and empower them in their identity as an Aboriginal person, make them feel strong in that. And then to bridge the gap between that and the western world. Helping them access what other kids in town take for granted.', who: 'Tanya Turner', role: 'Oonchiumpa Co-founder', avatar: '/images/team/tanya.jpg' },
  },
  {
    id: 'systems',
    name: 'Government Systems',
    color: '#71717a',
    radius: 400,
    description: 'The outermost ring. Government systems — youth justice, child protection, NDIS, education — exist, and the hub interfaces with them. But they don\'t drive the model. The young person does.',
    elements: [
      { name: 'Youth Justice', detail: '$97M/year. The hub offers an alternative pathway — cultural diversion through elder authority, not institutional correction.' },
      { name: 'Child Protection', detail: '$3.16B to TFHC. The hub prevents the conditions that trigger removal by supporting families on country.' },
      { name: 'NDIS', detail: '$238M committed in Central Australia. The hub navigates the system so the money reaches people.' },
      { name: 'Education', detail: 'Attendance crisis. The hub bridges two worlds — school and country — so young people can walk in both.' },
    ],
    systemComparison: 'This is where the current system starts. Policy → department → program → contract → provider → intake → the child. Six layers of bureaucracy before anyone asks the young person what they need.',
    voice: { quote: 'There is extensive funding to coordinate the justice system, but little or no coordination of the more than 150 services provided government funding to support our young people.', who: 'Oonchiumpa Alliance Statement', role: 'August 2024' },
  },
];

// ── Layer Photos (real Oonchiumpa images) ───────────────────────────────

const LAYER_PHOTOS: Record<string, { src: string; caption: string }> = {
  culture: { src: '/images/model/atnarpa-ranges.jpg', caption: 'Atnarpa — Oonchiumpa\'s country in the MacDonnell Ranges' },
  family: { src: '/images/model/community-on-country.jpg', caption: 'Oonchiumpa family and community on country at Atnarpa' },
  community: { src: '/images/model/atnarpa-facilities.jpg', caption: 'Current Atnarpa facilities — what $3M in capital would upgrade' },
  services: { src: '/images/stories/IMG_9698.jpg', caption: 'Oonchiumpa staff — cultural brokers navigating 32+ partner organisations' },
};

// ── Key Frameworks ──────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    name: 'Social & Emotional Wellbeing (SEWB)',
    origin: 'National Aboriginal Health Strategy (1989)',
    desc: 'Holistic model of health — connection to body, mind, emotions, family, community, culture, country, and spirit. All interconnected. If one is severed, all suffer.',
    alignment: 'The hub model IS the SEWB framework in practice. Every element maps directly.',
  },
  {
    name: 'ARACY Nest Framework',
    origin: 'Mparntwe Youth Action Plan 2023-27',
    desc: '7 wellbeing domains: Being loved and safe, Having material basics, Being healthy, Learning, Participating, Culture and identity, Environment.',
    alignment: 'Already adopted by the Mparntwe Local Action Group. Oonchiumpa delivers across all 7 domains.',
  },
  {
    name: 'Heckman Curve',
    origin: 'Nobel Prize economist James Heckman',
    desc: 'Evidence that investment in earliest years yields highest lifetime returns. Every dollar spent at 0-5 returns $7-13. Every dollar spent at 15 (detention) returns cents.',
    alignment: 'Children\'s Ground operates on this evidence. The hub extends it — early connection, not just early intervention.',
  },
  {
    name: 'Justice Reinvestment',
    origin: 'Paul Ramsay Foundation / Maranguka',
    desc: 'Redirect money from incarceration to community-led programs in the places where incarceration rates are highest. Proven in Bourke (Maranguka): 18% drop in charges.',
    alignment: 'The hub IS justice reinvestment — redirecting $4,000/day detention spend to community-controlled alternatives.',
  },
  {
    name: 'Both Ways / Two Worlds',
    origin: 'Arrernte educational philosophy',
    desc: 'Young people need to walk strong in their own culture AND navigate the non-Indigenous world. One doesn\'t replace the other.',
    alignment: 'Oonchiumpa\'s core philosophy. Cultural foundation + service navigation. Elders + NDIS. Country + school.',
  },
];

// ── Page ────────────────────────────────────────────────────────────────

const ModelPage: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('self');
  const active = LAYERS.find(l => l.id === activeLayer) || LAYERS[0];

  return (
    <div className="bg-black text-white font-['Inter',sans-serif] min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none z-50" style={{ backgroundImage: grain, opacity: 0.04 }} />

      {/* Hero — two paths image at top */}
      <section className="px-6 pt-24 pb-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-4">The Model</p>
          <h1 className="text-4xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] mb-4">Inside Out, Not Outside In</h1>
          <p className="text-lg text-zinc-500 font-light max-w-2xl mx-auto mb-10">
            The current system works outside-in: departments, programs, contracts, then the child.
            The Oonchiumpa model works inside-out: identity, culture, family, community — then services when needed.
          </p>
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden">
            <img src="/images/model/two-paths.png" alt="Two paths: institution vs country" className="w-full" />
          </div>
          <p className="text-[10px] text-zinc-700 mt-3">Same young person. Two paths. One leads to concrete and wire. The other leads home.</p>
        </div>
      </section>

      {/* Interactive Model */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8 items-start">

            {/* SVG Concentric Circles */}
            <div className="flex justify-center sticky top-20">
              <svg viewBox="0 0 860 860" className="w-full max-w-[500px]">
                {/* Rings — outermost first */}
                {[...LAYERS].reverse().map(layer => {
                  const isActive = layer.id === activeLayer;
                  return (
                    <g key={layer.id} onClick={() => setActiveLayer(layer.id)} className="cursor-pointer">
                      <circle
                        cx={430} cy={430} r={layer.radius}
                        fill="none"
                        stroke={layer.color}
                        strokeWidth={isActive ? 3 : 1.5}
                        opacity={isActive ? 0.8 : 0.2}
                        className="transition-all duration-500"
                      />
                      {/* Filled ring area */}
                      <circle
                        cx={430} cy={430} r={layer.radius}
                        fill={layer.color}
                        opacity={isActive ? 0.08 : 0.02}
                        className="transition-all duration-500"
                      />
                    </g>
                  );
                })}

                {/* Center dot */}
                <circle cx={430} cy={430} r={20} fill="#fbbf24" opacity={activeLayer === 'self' ? 1 : 0.6} className="transition-all duration-500" />

                {/* Labels on the rings */}
                {LAYERS.map(layer => {
                  const isActive = layer.id === activeLayer;
                  // Position labels at different angles
                  const angles: Record<string, number> = { self: 0, culture: -30, family: -60, community: -90, services: -120, systems: -150 };
                  const angle = (angles[layer.id] || 0) * Math.PI / 180;
                  const labelR = layer.id === 'self' ? 0 : layer.radius;
                  const x = 430 + Math.cos(angle) * labelR;
                  const y = 430 + Math.sin(angle) * labelR;

                  if (layer.id === 'self') return null;

                  return (
                    <g key={`label-${layer.id}`} onClick={() => setActiveLayer(layer.id)} className="cursor-pointer">
                      <text
                        x={x} y={y - 8}
                        fill={layer.color}
                        opacity={isActive ? 1 : 0.5}
                        fontSize={isActive ? 11 : 9}
                        fontWeight={isActive ? 700 : 500}
                        textAnchor="middle"
                        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        className="transition-all duration-500"
                      >
                        {layer.name}
                      </text>
                    </g>
                  );
                })}

                {/* Center label */}
                <text x={430} y={430 + 40} fill="#fbbf24" fontSize={10} fontWeight={700} textAnchor="middle"
                  style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                  opacity={activeLayer === 'self' ? 1 : 0.5}
                  onClick={() => setActiveLayer('self')} className="cursor-pointer">
                  The Young Person
                </text>

                {/* Direction arrows */}
                <text x={430} y={50} fill="#71717a" fontSize={9} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Systems (outermost)
                </text>
                <text x={430} y={810} fill="#fbbf24" fontSize={9} textAnchor="middle" opacity={0.6} style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Inside Out
                </text>
              </svg>
            </div>

            {/* Detail Panel */}
            <div>
              {/* Layer info */}
              <div className="rounded-2xl border border-white/[0.07] p-6 md:p-8 mb-4" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: active.color }} />
                  <h2 className="text-xl font-medium" style={{ color: active.color }}>{active.name}</h2>
                  {active.arrernte && <span className="text-xs text-zinc-600 italic">{active.arrernte}</span>}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{active.description}</p>

                <div className="space-y-3 mb-6">
                  {active.elements.map((el, i) => (
                    <div key={i} className="pl-4 border-l-2" style={{ borderColor: `${active.color}30` }}>
                      <h4 className="text-sm font-semibold text-zinc-200 mb-0.5">{el.name}</h4>
                      <p className="text-sm text-zinc-500 leading-relaxed">{el.detail}</p>
                    </div>
                  ))}
                </div>

                {/* Real photo for this layer */}
                {LAYER_PHOTOS[active.id] && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img src={LAYER_PHOTOS[active.id].src} alt="" className="w-full h-48 object-cover" />
                    <p className="text-[10px] text-zinc-600 mt-2">{LAYER_PHOTOS[active.id].caption}</p>
                  </div>
                )}

                {/* Voice — real quote */}
                {active.voice && (
                  <div className="mb-6 p-5 rounded-xl" style={{ background: `${active.color}08`, border: `1px solid ${active.color}15` }}>
                    <p className="text-sm text-zinc-300 leading-relaxed italic mb-3">"{active.voice.quote}"</p>
                    <div className="flex items-center gap-3">
                      {active.voice.avatar ? (
                        <img src={active.voice.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${active.color}20`, color: active.color }}>
                          {active.voice.who.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-zinc-300">{active.voice.who}</p>
                        <p className="text-[10px] text-zinc-600">{active.voice.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* System comparison */}
                <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-sunset-400/50 mb-2">How the Current System Handles This</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{active.systemComparison}</p>
                </div>
              </div>

              {/* Layer navigation */}
              <div className="flex flex-wrap gap-2">
                {LAYERS.map(l => (
                  <button key={l.id} onClick={() => setActiveLayer(l.id)}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] uppercase rounded-lg border transition-all ${
                      l.id === activeLayer
                        ? 'border-current'
                        : 'border-white/[0.08] text-zinc-600 hover:text-zinc-400'
                    }`}
                    style={l.id === activeLayer ? { color: l.color, borderColor: `${l.color}40`, background: `${l.color}10` } : undefined}
                  >{l.name}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Key Insight */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* The visual story */}
          <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/[0.07] mb-10">
            {/* Left: the system — oppressive */}
            <div className="relative p-8 md:p-10" style={{ background: 'linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 100%)' }}>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sunset-400/50 mb-8">The Current System</p>

              {/* Narrowing funnel — each layer is more indented and smaller, crushing down */}
              <div className="space-y-1">
                {[
                  { text: 'Policy', size: 'text-2xl', opacity: 'text-zinc-300', indent: 'pl-0' },
                  { text: 'Department', size: 'text-xl', opacity: 'text-zinc-400', indent: 'pl-4' },
                  { text: 'Program', size: 'text-lg', opacity: 'text-zinc-500', indent: 'pl-8' },
                  { text: 'Contract', size: 'text-base', opacity: 'text-zinc-500', indent: 'pl-12' },
                  { text: 'Provider', size: 'text-sm', opacity: 'text-zinc-600', indent: 'pl-16' },
                  { text: 'Intake', size: 'text-xs', opacity: 'text-zinc-700', indent: 'pl-20' },
                ].map((layer, i) => (
                  <p key={i} className={`${layer.indent} ${layer.size} ${layer.opacity} font-medium leading-relaxed`}>{layer.text}</p>
                ))}
                <p className="pl-24 text-xs text-sunset-400 font-bold mt-2">The Child</p>
              </div>

              <p className="text-xs text-zinc-700 mt-8 leading-relaxed">
                Six layers of bureaucracy before anyone asks the young person what they need.
                The child is at the bottom — smallest, last, defined by everyone else's process.
              </p>

              {/* Subtle oppressive lines */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.5) 40px, rgba(255,255,255,0.5) 41px)'
              }} />
            </div>

            {/* Right: the Oonchiumpa way — radiating warmth */}
            <div className="relative p-8 md:p-10" style={{ background: 'radial-gradient(circle at 50% 20%, rgba(52,211,153,0.06) 0%, rgba(10,10,10,1) 70%)' }}>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-eucalyptus-400/50 mb-8">The Oonchiumpa Way</p>

              {/* Radiating outward — largest first, getting quieter */}
              <div className="space-y-3">
                <p className="text-2xl md:text-3xl text-eucalyptus-400 font-medium">The Young Person</p>
                <p className="text-lg text-zinc-200 font-medium pl-2">Culture & Country</p>
                <p className="text-base text-zinc-300 pl-4">Family & Kinship</p>
                <p className="text-sm text-zinc-400 pl-6">Community & Place</p>
                <p className="text-sm text-zinc-500 pl-8">Services <span className="text-zinc-600">(when needed)</span></p>
                <p className="text-xs text-zinc-700 pl-10">Systems <span className="text-zinc-800">(interfaced with)</span></p>
              </div>

              <p className="text-sm text-eucalyptus-400/40 mt-8 leading-relaxed">
                The relationship already exists. The identity is already formed.
                Services support — they don't define.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Real Outcomes */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-3">Proven Outcomes</p>
          <h2 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] mb-4">What Has Already Changed</h2>
          <p className="text-base text-zinc-500 font-light max-w-2xl mb-10">
            These are not projections. This is what Oonchiumpa has already achieved with current resources — independently evaluated.
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { v: '20/21', l: 'Off the Taskforce List', s: 'Of 21 Operation Luna referrals, only 1 remained' },
              { v: '72%', l: 'Returned to Education', s: 'Young people who had disengaged from school' },
              { v: '90%', l: 'Retention Rate', s: 'Young people chose to stay in the program' },
              { v: '95%', l: 'School Re-engagement', s: 'Across the youth mentorship program' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] p-5 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-2xl font-medium text-eucalyptus-400">{s.v}</div>
                <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-500 mt-1">{s.l}</div>
                <div className="text-[10px] text-zinc-700 mt-1">{s.s}</div>
              </div>
            ))}
          </div>

          {/* Real stories */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                initial: 'MS',
                before: 'Disconnected from all services. On a police search list — whereabouts couldn\'t be found by any agency.',
                after: 'After an on-country trip seeing Aboriginal people running cultural tourism, MS stated he wanted to do that with his mob. He is now working on a similar tourism venture on his own country.',
                theme: 'Identity → Purpose',
              },
              {
                initial: 'M',
                before: 'Father deceased. No room of her own — belongings stolen by transient adults at her aunty\'s camp. Mother on a 10-year housing waitlist.',
                after: 'Now living independently with her own income. Stable, safe, and self-determining.',
                theme: 'Crisis → Independence',
              },
              {
                initial: 'J',
                before: 'Wouldn\'t come to the office unless physically picked up. Completely disengaged from every service.',
                after: 'Now arranges her own transport to come and "hang out." Engaged, connected, choosing to show up.',
                theme: 'Withdrawal → Agency',
              },
              {
                initial: 'CB',
                before: 'Didn\'t understand the importance of his cultural role. Disconnected from responsibility and identity.',
                after: 'He is now able to reflect on his actions and feeling remorse. He knows he can be a leader.',
                theme: 'Disconnection → Leadership',
              },
            ].map((story, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-eucalyptus-400/10 flex items-center justify-center text-eucalyptus-400 text-sm font-bold">{story.initial}</div>
                  <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-eucalyptus-400/50">{story.theme}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-sunset-400/40 mb-1">Before</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{story.before}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-eucalyptus-400/40 mb-1">After</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{story.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Young people's voice */}
          <div className="mt-10 rounded-2xl border border-white/[0.07] p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xl md:text-2xl text-eucalyptus-400 font-medium italic mb-4">"We all green, we Oonchiumpa."</p>
            <p className="text-xs text-zinc-600">— Young person in the program</p>
          </div>
        </div>
      </section>

      {/* True Justice */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-amber-400/60 mb-3">True Justice</p>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.02em] mb-4">Deep Listening on Country</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Since 2022, Oonchiumpa and ANU have brought judges, law students, and community together at Atnarpa Homestead for deep listening circles. The university positions itself as a listening institution — it is not responsible for course content. The community leads.
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                This is radical — a law school that says "we don't teach here, we listen." Judges sit on the same level as elders. Law students sit on the same level as young people. The hierarchy dissolves. Understanding forms.
              </p>
              <div className="rounded-xl p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-sm text-zinc-300 leading-relaxed italic mb-3">"The law reduces people to categories. Being on this country with these stunning views and learning our true history changes everything."</p>
                <p className="text-xs text-zinc-600">— Suzie Ma, ANU law student</p>
              </div>
              <div className="rounded-xl p-5 border border-white/[0.07] mt-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-sm text-zinc-300 leading-relaxed italic mb-3">"They're sitting on the same level, conversing with us. That comes from their passion for knowledge being passed down to them and now passing it on to us."</p>
                <p className="text-xs text-zinc-600">— Chelsea Kenneally, ANU law student</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden flex-1">
                <img src="/images/model/community-on-country.jpg" alt="Community on country" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src="/images/stories/IMG_9713.jpg" alt="Oonchiumpa staff" className="w-full h-48 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kristy & Tanya */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-3">The Founders</p>
          <h2 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] mb-10">Two Women, Two Worlds</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kristy */}
            <div className="rounded-2xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-4 mb-5">
                <img src="https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/profile-images/storytellers/kristy_bloomfield.jpg" alt="Kristy Bloomfield" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-semibold text-zinc-200">Kristy Bloomfield</h3>
                  <p className="text-xs text-zinc-500">Co-founder, Traditional Owner, Arrernte woman</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Kristy's great-grandmother worked as a servant on her own country at Atnarpa. Her grandfather was Stolen Generation — had to marry her grandmother in Tennant Creek in a week because police threatened to take their children.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  In 1994, the family camped at Atnarpa for the land claim — sang and danced on country. The title came through in 2012. Now Kristy runs Oonchiumpa from that same country, ensuring the next generation of young people know who they are.
                </p>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' }}>
                  <p className="text-sm text-zinc-300 italic leading-relaxed">"You mob come see them, they up straight away."</p>
                  <p className="text-[10px] text-zinc-600 mt-2">— On the difference when Oonchiumpa shows up</p>
                </div>
              </div>
            </div>

            {/* Tanya */}
            <div className="rounded-2xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-4 mb-5">
                <img src="/images/team/tanya.jpg" alt="Tanya Turner" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-base font-semibold text-zinc-200">Tanya Turner</h3>
                  <p className="text-xs text-zinc-500">Co-founder, grew up in Alice Springs</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Tanya left Alice Springs for Melbourne. Got on a tram one day and had a moment: "I need to go home." Resigned two weeks later. Driving from the airport, she saw the ranges and went: "Wow, it's really beautiful here." First time she'd seen it with fresh eyes.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  She brought with her experience in legal advocacy — including involvement in the landmark Andrew Bolt racial vilification case. Now she bridges two worlds at Oonchiumpa: the legal and institutional world she navigated in Melbourne, and the cultural world she came home to.
                </p>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.1)' }}>
                  <p className="text-sm text-zinc-300 italic leading-relaxed">"Helping them access what other kids in town take for granted."</p>
                  <p className="text-[10px] text-zinc-600 mt-2">— On Oonchiumpa's mission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grounding Frameworks */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-eucalyptus-400 mb-3">Grounded In Evidence</p>
          <h2 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] mb-4">Supporting Frameworks</h2>
          <p className="text-base text-zinc-500 font-light max-w-2xl mb-10">
            The Oonchiumpa model isn't invented — it's the convergence of Indigenous knowledge systems and the strongest evidence in developmental science, justice reinvestment, and public health.
          </p>

          <div className="space-y-3">
            {FRAMEWORKS.map((f, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-sm font-semibold text-zinc-200">{f.name}</h3>
                  <span className="text-[10px] text-zinc-600">{f.origin}</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-3">{f.desc}</p>
                <div className="flex items-start gap-2">
                  <span className="text-eucalyptus-400 mt-0.5 text-xs shrink-0">+</span>
                  <p className="text-sm text-eucalyptus-400/80 leading-relaxed">{f.alignment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference */}
      <section className="px-6 py-16 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-px bg-zinc-800 max-w-xs mx-auto mb-12" />
          <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed mb-6">
            A service model puts the service at the centre and asks the young person to fit into it.
          </p>
          <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed mb-6">
            The Oonchiumpa model puts the young person at the centre and wraps everything else around who they already are.
          </p>
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
            The difference is 90% retention vs 60% return to detention.
          </p>
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mt-2">
            The difference is identity vs a case number.
          </p>
          <p className="text-eucalyptus-400 text-2xl md:text-3xl font-medium tracking-[-0.02em] mt-10">
            Inside out. Not outside in.
          </p>
          <p className="mt-12 text-[10px] tracking-[0.25em] uppercase text-zinc-700">
            Grounded in SEWB, ARACY Nest, Heckman, Justice Reinvestment, and 60,000 years of continuous culture
          </p>
        </div>
      </section>
    </div>
  );
};

export default ModelPage;
