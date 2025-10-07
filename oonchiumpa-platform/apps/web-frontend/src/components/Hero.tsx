const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-ochre-yellow via-ochre-orange to-ochre-red min-h-screen flex items-center cultural-pattern">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Two Cultures,
              <br />
              <span className="text-ancestral-gold">One World</span>,
              <br />
              Working Together
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl">
              We are <strong>Oonchiumpa</strong> — traditional owners providing 
              culturally-led youth services that transform lives and strengthen community. 
              Our work bridges two worlds with respect, authority, and proven results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-surface-variant transition-colors shadow-lg">
                Our Impact
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors">
                Young People's Stories
              </button>
            </div>
          </div>

          {/* Key statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-in-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">87-95%</div>
              <div className="text-white/80 text-sm">Engagement Rate</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">80%</div>
              <div className="text-white/80 text-sm">No Longer Need Intensive Case Management</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">$91</div>
              <div className="text-white/80 text-sm">Daily Cost vs $3,852 Incarceration</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-1">8</div>
              <div className="text-white/80 text-sm">Language Groups Served</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cultural design elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero