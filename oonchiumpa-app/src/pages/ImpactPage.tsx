import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../components/Section';
import { Card, CardBody } from '../components/Card';
import { EditableImage } from '../components/EditableImage';
import { HeroVideo } from '../components/HeroVideo';
import { GeographicReachMap } from '../components/GeographicReachMap';
import { ServiceProgramsRail } from '../components/ServiceProgramsRail';
import { useProjectAnalysis } from '../hooks/useEmpathyLedger';

const headlineMetrics = [
  { value: '95%', label: 'Diversion success', detail: 'Young people diverted from deeper justice-system contact.' },
  { value: '$91/day', label: 'Program cost', detail: 'Compared with $3,852/day incarceration — 97.6% less.' },
  { value: '72%', label: 'Returned to education', detail: 'From 2,464 one-on-one and family engagements in six months.' },
  { value: '100%', label: 'Aboriginal employment', detail: 'Service delivery and leadership are Aboriginal-led.' },
];

// Flip `show` to true once real values are in. Until then, the strip hides.
const methodology = {
  show: false,
  window: '',
  cohort: '',
  evaluator: '',
  lastUpdated: '',
};

const theoryOfChange = [
  {
    stage: 'Inputs',
    title: 'Cultural authority + daily delivery',
    points: ['Traditional Owner governance', 'Aboriginal staff team', 'On-Country infrastructure at Atnarpa'],
  },
  {
    stage: 'Activities',
    title: 'Family-inclusive, trauma-aware support',
    points: ['Daily mentoring and school engagement', 'On-Country cultural learning', 'Coordination across justice, health, housing'],
  },
  {
    stage: 'Outputs',
    title: 'Consistent, measurable engagement',
    points: ['2,464 recorded engagements (6 months)', '71 successful service referrals', '7 language groups represented'],
  },
  {
    stage: 'Outcomes',
    title: 'Diversion, belonging, pathways',
    points: ['95% diverted from deeper justice contact', '72% re-engaged with education', '80% improved wellbeing indicators'],
  },
];

const domainOutcomes = [
  {
    title: 'Education and pathways',
    body: 'School re-engagement, attendance support, and practical planning for work and training.',
    stats: ['72% returned to education', '95% commenced support pathways'],
  },
  {
    title: 'Wellbeing and cultural identity',
    body: 'Mentoring, on-Country learning, and culturally-safe support improve confidence and belonging.',
    stats: ['7 language groups represented', '80% improved wellbeing indicators'],
  },
  {
    title: 'Family and service coordination',
    body: 'Integrated coordination across kinship networks, schools, health, justice, and housing services.',
    stats: ['71 successful referrals', '0 referrals declined by partners'],
  },
  {
    title: 'Justice diversion outcomes',
    body: 'Cultural authority and practical follow-through reduce contact with detention pathways.',
    stats: ['20 of 21 removed from Operation Luna', 'High sustained engagement rates'],
  },
];

// Replace author/context with real (consented) names, ages, and places when ready.
// Generic "Young participant" reads as fabricated to funders — first name + age/role
// + community makes these testimonials credible. Only publish with consent on record.
// An empty context is hidden on render.
const testimonials = [
  {
    quote:
      'I think other kids should work with you mob. I think everyone should work with Oonchiumpa. You mob are good and help.',
    author: 'Young participant',
    context: '',
  },
  {
    quote:
      'You mob come see them, they up straight away. They listen, get ready, and start the day.',
    author: 'Family member',
    context: '',
  },
  {
    quote:
      'The girls are really comfortable with your team and they work well when you are in the room with them.',
    author: 'School partner',
    context: '',
  },
];

export const ImpactPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysis } = useProjectAnalysis();

  return (
    <div className="bg-white">
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <HeroVideo
          src="/videos/hero/alice-drone.mp4"
          poster="/videos/hero/alice-drone.jpg"
          alt="Drone view of Alice Springs at golden hour"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/50 to-transparent" />

        <div className="relative z-10 container-custom pt-28 pb-14 md:pb-18">
          <p className="eyebrow text-ochre-200 mb-4">Impact</p>
          <h1 className="heading-lg text-white mb-5 max-w-4xl">
            $91 a day keeps a young person on Country.
            <span className="block text-white/70 mt-2">Detention costs $3,852.</span>
          </h1>
          <p className="text-white/85 text-lg max-w-3xl leading-relaxed mb-8">
            Oonchiumpa is Aboriginal-led diversion that works — 95% of young people referred to us stay out of deeper
            justice-system contact. Below: the evidence, the method, and the numbers funders and partners ask for.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/contact?type=partnership')} className="btn-primary">
              Partner with us
            </button>
            <button
              onClick={() => navigate('/contact?type=partnership')}
              className="btn-secondary border-white/50 bg-white/10 text-white hover:bg-white/20"
            >
              Request impact report
            </button>
          </div>
        </div>
      </section>

      <section className="bg-earth-950 text-white py-12">
        <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-7">
          {headlineMetrics.map((metric) => (
            <div key={metric.label} className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-display text-ochre-300">{metric.value}</p>
              <p className="text-sm md:text-base text-white/85 mt-2">{metric.label}</p>
              <p className="text-xs text-white/55 mt-1 leading-relaxed">{metric.detail}</p>
            </div>
          ))}
        </div>
        {methodology.show && (
          <div className="container-custom mt-8 pt-6 border-t border-white/10 text-xs text-white/55 flex flex-wrap gap-x-6 gap-y-2">
            <span>Measurement window: {methodology.window}</span>
            <span>Cohort: {methodology.cohort}</span>
            <span>Evaluator: {methodology.evaluator}</span>
            <span>Last updated: {methodology.lastUpdated}</span>
          </div>
        )}
      </section>

      <Section className="bg-white">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <p className="eyebrow mb-4">Theory of change</p>
          <h2 className="heading-lg mb-5">How cultural authority becomes measurable outcomes</h2>
          <p className="lead-text">
            Inputs to outcomes, in plain language. The same logic funders use to assess investment — applied to our delivery model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {theoryOfChange.map((col, i) => (
            <div key={col.stage} className="relative section-shell p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-ochre-600 font-semibold mb-2">
                {`${i + 1}. ${col.stage}`}
              </p>
              <h3 className="text-lg font-display text-earth-950 mb-3 leading-snug">{col.title}</h3>
              <ul className="space-y-2">
                {col.points.map((point) => (
                  <li key={point} className="text-sm text-earth-700 flex items-start gap-2">
                    <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-ochre-500 flex-none" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow mb-4">Performance snapshot</p>
          <h2 className="heading-lg mb-5">Cost-effective outcomes with sustained engagement</h2>
          <p className="lead-text">
            Comparative evidence shows prevention and cultural support are significantly more effective than detention pathways.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardBody className="p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-earth-500 mb-3">Cost comparison</p>
              <h3 className="text-2xl font-display text-earth-950 mb-4">Program investment vs incarceration</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-earth-700">Oonchiumpa</span>
                    <span className="font-semibold text-eucalyptus-700">$91/day</span>
                  </div>
                  <div className="h-2 rounded-full bg-eucalyptus-100 overflow-hidden">
                    <div className="h-full w-[3%] bg-eucalyptus-600" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-earth-700">Youth detention</span>
                    <span className="font-semibold text-sunset-700">$3,852/day</span>
                  </div>
                  <div className="h-2 rounded-full bg-sunset-100 overflow-hidden">
                    <div className="h-full w-full bg-sunset-600" />
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm text-earth-700">
                97.6% more cost-effective while supporting stronger social and cultural outcomes.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-earth-950 text-white border-earth-900">
            <CardBody className="p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-ochre-200 mb-3">Diversion result</p>
              <h3 className="text-2xl font-display text-white mb-5">Breaking the cycle early</h3>
              <div className="grid grid-cols-2 gap-5 text-center">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-4xl font-display text-ochre-300">20</p>
                  <p className="text-xs text-white/75 mt-1">Removed from Operation Luna</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-4xl font-display text-ochre-300">1</p>
                  <p className="text-xs text-white/75 mt-1">Remaining active case</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-white/80 leading-relaxed">
                Diversion performance is tied to cultural authority, daily consistency, and family-inclusive delivery.
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="section-shell bg-earth-950 text-white p-8 md:p-10 max-w-5xl mx-auto">
          <blockquote className="text-xl md:text-2xl leading-relaxed text-white/95 text-center">
            "We're able to lead this youth space because cultural authority guides every decision; our young people see their future on Country."
          </blockquote>
          <p className="text-center mt-4 text-ochre-200 text-sm">Kristy Bloomfield, Director</p>
        </div>
      </Section>

      <Section className="bg-sand-50">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow mb-4">Impact domains</p>
          <h2 className="heading-lg mb-5">Integrated outcomes across key life areas</h2>
          <p className="lead-text">
            Oonchiumpa works across education, justice, wellbeing, and family systems as a single service pathway.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {domainOutcomes.map((domain) => (
            <div key={domain.title} className="section-shell p-7 md:p-8">
              <h3 className="text-2xl font-display text-earth-950 mb-3">{domain.title}</h3>
              <p className="text-earth-700 leading-relaxed mb-5">{domain.body}</p>
              <ul className="space-y-2">
                {domain.stats.map((stat) => (
                  <li key={stat} className="text-sm text-earth-700 flex items-start gap-2">
                    <span className="mt-1 block h-2 w-2 rounded-full bg-ochre-500" />
                    <span>{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {analysis?.analyzed && (
        <Section className="bg-white">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <p className="eyebrow mb-4">Live analysis feed</p>
            <h2 className="heading-lg mb-5">Empathy Ledger analysis snapshot</h2>
            <p className="lead-text">
              This section reads directly from Empathy Ledger project analysis to surface current themes and signal quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="section-shell p-6 text-center">
              <p className="text-3xl font-display text-ochre-700">{analysis.storytellerCount}</p>
              <p className="text-earth-600 text-sm mt-2">Storytellers analysed</p>
            </div>
            <div className="section-shell p-6 text-center">
              <p className="text-3xl font-display text-ochre-700">{analysis.transcriptCount}</p>
              <p className="text-earth-600 text-sm mt-2">Transcripts analysed</p>
            </div>
            <div className="section-shell p-6 text-center">
              <p className="text-3xl font-display text-ochre-700">{analysis.qualityScore.toFixed(1)}</p>
              <p className="text-earth-600 text-sm mt-2">Analysis quality score</p>
            </div>
          </div>

          {analysis.themes.length > 0 && (
            <div className="section-shell p-7 md:p-8">
              <h3 className="text-2xl font-display text-earth-950 mb-4">Top themes</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.slice(0, 10).map((theme) => (
                  <span
                    key={theme.name}
                    className="px-3 py-1.5 rounded-lg bg-earth-100 border border-earth-200 text-earth-700 text-sm"
                  >
                    {theme.name} ({theme.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      <Section>
        <div className="text-center max-w-4xl mx-auto mb-10">
          <p className="eyebrow mb-4">Geographic reach</p>
          <h2 className="heading-lg mb-5">Service coverage across Central Australia</h2>
          <p className="lead-text">
            Primary service delivery in Alice Springs with on-Country activity and community links across remote locations.
          </p>
        </div>
        <GeographicReachMap />
      </Section>

      <ServiceProgramsRail
        slotPrefix="impact-program"
        eyebrow="Service portfolio"
        title="Programs driving these impact results"
        description="Each program page shows methods, measurable outcomes, and media evidence from delivery on the ground."
        className="bg-white"
      />

      <Section className="bg-sand-50">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="eyebrow mb-4">Community voices</p>
          <h2 className="heading-lg mb-5">What participants and families say</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Card key={item.author}>
              <CardBody className="p-7 md:p-8">
                <p className="text-earth-700 leading-relaxed italic mb-4">"{item.quote}"</p>
                <p className="text-sm text-ochre-700 font-semibold">{item.author}</p>
                {item.context && (
                  <p className="text-xs text-earth-500 mt-0.5">{item.context}</p>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="text-center max-w-4xl mx-auto">
          <p className="eyebrow mb-4">Next steps</p>
          <h2 className="heading-lg mb-5">Build stronger outcomes together</h2>
          <p className="lead-text mb-8">
            Collaboration with funders, service partners, and policymakers helps scale Aboriginal-led solutions that work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/contact?type=partnership')} className="btn-primary">
              Start a partnership
            </button>
            <button
              onClick={() => navigate('/contact?type=partnership')}
              className="btn-secondary"
            >
              Request impact report
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ImpactPage;
