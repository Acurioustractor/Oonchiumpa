const Impact = () => {
  const metrics = [
    {
      value: "57%",
      label: "Client Growth",
      description: "From 19 to 30 clients with same funding",
      icon: "📈"
    },
    {
      value: "100%",
      label: "Recidivism Reduction",
      description: "Of 7 clients previously convicted, only 1 reoffended",
      icon: "⚖️"
    },
    {
      value: "2,464",
      label: "Individual Contacts",
      description: "Staff engagements in 6 months (Jan-June 2025)",
      icon: "🤝"
    },
    {
      value: "100%",
      label: "Aboriginal Employment",
      description: "11 staff connected culturally to Mbantua",
      icon: "👥"
    },
    {
      value: "2.4%",
      label: "Of Incarceration Cost",
      description: "$91/day vs $3,852 detention cost",
      icon: "💰"
    },
    {
      value: "85%",
      label: "Reduction in Recidivism",
      description: "Evidence-based crime prevention outcomes",
      icon: "🛡️"
    }
  ]

  return (
    <section className="py-24 bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Real Impact, Real Results
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Our culturally-led approach delivers measurable outcomes that transform lives 
            and strengthen community. These aren't just numbers—they represent young people 
            finding their way home to culture and purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border-l-4 border-primary"
            >
              <div className="text-4xl mb-4">{metric.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
              <h3 className="text-lg font-semibold text-text mb-3">{metric.label}</h3>
              <p className="text-text-secondary leading-relaxed">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Walker Inquest Connection */}
        <div className="bg-gradient-to-r from-ceremonial-red to-ochre-red rounded-xl p-8 text-white">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-4">Walker Inquest: A Service That's Needed</h3>
            <p className="text-lg leading-relaxed mb-6">
              "Robust and sustained funding for Oonchiumpa is not simply justified but imperative 
              in light of the Coroner's findings. Oonchiumpa exemplifies the attributes of cultural 
              respect, community partnership, responsiveness, and accountability required to rebuild 
              trust and ensure better outcomes for Aboriginal youth."
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-ceremonial-red px-6 py-3 rounded-lg font-semibold hover:bg-surface-variant transition-colors">
                Read Full Impact Report
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Walker Inquest Response
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Impact