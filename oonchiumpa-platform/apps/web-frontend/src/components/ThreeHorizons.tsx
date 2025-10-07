import { useState } from 'react'

const ThreeHorizons = () => {
  const [activeHorizon, setActiveHorizon] = useState(1)

  const horizons = [
    {
      id: 1,
      title: "Horizon 1: Proven Excellence",
      subtitle: "Current State - What We Do Best",
      color: "from-ochre-red to-ceremonial-red",
      items: [
        {
          title: "Alternative Service Response",
          description: "87-95% engagement rate with culturally-led youth work",
          metric: "30 clients served with same funding as 18"
        },
        {
          title: "Cultural Authority Leadership", 
          description: "100% Aboriginal staff serving 8 language groups",
          metric: "2,464 individual contacts in 6 months"
        },
        {
          title: "Cost-Effective Outcomes",
          description: "2.4% of incarceration cost with better results",
          metric: "$91/day vs $3,852 detention"
        },
        {
          title: "Operation Luna Success",
          description: "80% no longer require intensive case management",
          metric: "Evidence-based crime prevention"
        }
      ]
    },
    {
      id: 2, 
      title: "Horizon 2: Scaling Success",
      subtitle: "Strategic Growth - Building Capacity",
      color: "from-ochre-yellow to-ancestral-gold",
      items: [
        {
          title: "Oonchiumpa Hub",
          description: "Single service point replacing fragmented system",
          metric: "All providers, one cultural authority"
        },
        {
          title: "St. Mary's Transformation",
          description: "Historical trauma site becomes healing space",
          metric: "Safe accommodation + cultural programs"
        },
        {
          title: "Training & Employment Pathways",
          description: "From school re-engagement to career development", 
          metric: "Stockmen, tradesmen, electricians on country"
        },
        {
          title: "Regional Replication",
          description: "NIAA model scaling to other communities",
          metric: "Tenant Creek, Darwin, Katherine adaptations"
        }
      ]
    },
    {
      id: 3,
      title: "Horizon 3: Transformational Vision", 
      subtitle: "Future State - Generational Change",
      color: "from-spinifex-green to-mulga-green",
      items: [
        {
          title: "Economic Development on Country",
          description: "Generational wealth creation through traditional ownership",
          metric: "Loves Creek tourism + contracting business"
        },
        {
          title: "Self-Determination & Governance",
          description: "Aboriginal authority replacing colonial control structures", 
          metric: "Cultural protocols + modern systems"
        },
        {
          title: "National Youth Justice Model",
          description: "Walker Inquest response becoming best practice",
          metric: "32 recommendations implemented"
        },
        {
          title: "Intergenerational Healing",
          description: "Breaking intervention trauma cycles permanently",
          metric: "Cultural strength + systemic change"
        }
      ]
    }
  ]

  return (
    <section className="py-24 bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Three Horizons Model
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            Our strategic framework moves from proven excellence to transformational change. 
            This isn't just about sustaining good work—it's about building the future our 
            young people and community deserve.
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex flex-col md:flex-row justify-center mb-12 gap-4">
          {horizons.map((horizon) => (
            <button
              key={horizon.id}
              onClick={() => setActiveHorizon(horizon.id)}
              className={`px-6 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                activeHorizon === horizon.id
                  ? `bg-gradient-to-r ${horizon.color} text-white shadow-lg`
                  : 'bg-surface-variant text-text-secondary hover:bg-surface-variant/80'
              }`}
            >
              <div className="text-sm opacity-80">{horizon.subtitle}</div>
              <div>{horizon.title}</div>
            </button>
          ))}
        </div>

        {/* Active Horizon Content */}
        {horizons.map((horizon) => (
          activeHorizon === horizon.id && (
            <div key={horizon.id} className="animate-fade-in">
              <div className={`bg-gradient-to-r ${horizon.color} rounded-xl p-8 text-white mb-8`}>
                <h3 className="text-3xl font-bold mb-4">{horizon.title}</h3>
                <p className="text-xl opacity-90">{horizon.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {horizon.items.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-primary">
                    <h4 className="text-xl font-bold text-text mb-3">{item.title}</h4>
                    <p className="text-text-secondary mb-4 leading-relaxed">{item.description}</p>
                    <div className="bg-surface-variant rounded-lg p-3">
                      <div className="text-sm font-medium text-secondary">Key Metric:</div>
                      <div className="text-primary font-semibold">{item.metric}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Connection Between Horizons */}
        <div className="mt-16 bg-gradient-to-r from-waterhole-blue to-outback-sky rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">From Current Excellence to Future Vision</h3>
          <p className="text-lg leading-relaxed mb-6">
            Each horizon builds on the last. Our proven cultural authority (Horizon 1) enables 
            strategic scaling (Horizon 2), which creates the foundation for transformational 
            change (Horizon 3). This isn't theory—it's our roadmap from surviving to thriving.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Current Funding</div>
              <div className="opacity-90">Sustaining excellence with limited resources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">NIAA Partnership</div>
              <div className="opacity-90">Scaling proven model with adequate support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Generational Investment</div>
              <div className="opacity-90">Transforming systems for lasting change</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ThreeHorizons