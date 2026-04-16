const BrandSandboxPage = () => {
  return (
    <div className="min-h-screen bg-sand-50 p-8 space-y-12 pb-24">
      <header className="mb-12 border-b border-earth-200 pb-6">
        <h1 className="text-4xl font-display font-bold text-earth-950 mb-2">Brand Identity Sandbox</h1>
        <p className="text-lg text-earth-600 font-body">Visually test and play with the Oonchiumpa brand tokens here.</p>
        <p className="mt-4 text-sm text-ochre-600 bg-ochre-50 p-3 rounded-lg inline-block font-medium">
          💡 Try changing the colors in <code>tailwind.config.js</code> or the classes in <code>src/index.css</code>. 
          Vite's Hot Module Replacement will update this page instantly!
        </p>
      </header>

      {/* Typography Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100">
        <h2 className="text-2xl font-display font-bold text-earth-800 mb-6 border-b pb-2">Typography</h2>
        <div className="space-y-6">
          <div>
            <span className="text-xs text-earth-400 uppercase tracking-wide font-bold">Display Font / H1</span>
            <h1 className="text-5xl font-display font-bold text-earth-950">The Quick Brown Fox</h1>
          </div>
          <div>
            <span className="text-xs text-earth-400 uppercase tracking-wide font-bold">Display Font / H2</span>
            <h2 className="text-3xl font-display font-bold text-earth-800">Jumps Over The Lazy Dog</h2>
          </div>
          <div>
            <span className="text-xs text-earth-400 uppercase tracking-wide font-bold">Body Font / Paragraph</span>
            <p className="text-base font-body text-earth-700 max-w-2xl leading-relaxed">
              Storylistening is not just about hearing words; it is about creating a space where the speaker feels
              truly understood. When we sit together on this earth, wrapped in the colors of the sunset, we connect
              on a deeper level.
            </p>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100">
        <h2 className="text-2xl font-display font-bold text-earth-800 mb-8 border-b pb-2">Color Palette</h2>
        
        <div className="space-y-8">
          {/* Ochre */}
          <div>
            <h3 className="text-lg font-bold text-earth-800 mb-4 capitalize">Ochre</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={`ochre-${weight}`} className="flex flex-col items-center">
                  <div className={`w-full h-16 rounded-lg bg-ochre-${weight} shadow-inner`}></div>
                  <span className="text-xs text-earth-500 mt-2 font-mono">{weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earth */}
          <div>
            <h3 className="text-lg font-bold text-earth-800 mb-4 capitalize">Earth</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={`earth-${weight}`} className="flex flex-col items-center">
                  <div className={`w-full h-16 rounded-lg bg-earth-${weight} shadow-inner`}></div>
                  <span className="text-xs text-earth-500 mt-2 font-mono">{weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eucalyptus */}
          <div>
            <h3 className="text-lg font-bold text-earth-800 mb-4 capitalize">Eucalyptus</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={`eucalyptus-${weight}`} className="flex flex-col items-center">
                  <div className={`w-full h-16 rounded-lg bg-eucalyptus-${weight} shadow-inner`}></div>
                  <span className="text-xs text-earth-500 mt-2 font-mono">{weight}</span>
                </div>
              ))}
            </div>
          </div>

           {/* Sunset */}
           <div>
            <h3 className="text-lg font-bold text-earth-800 mb-4 capitalize">Sunset</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={`sunset-${weight}`} className="flex flex-col items-center">
                  <div className={`w-full h-16 rounded-lg bg-sunset-${weight} shadow-inner`}></div>
                  <span className="text-xs text-earth-500 mt-2 font-mono">{weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sand */}
          <div>
            <h3 className="text-lg font-bold text-earth-800 mb-4 capitalize">Sand</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                <div key={`sand-${weight}`} className="flex flex-col items-center">
                  <div className={`w-full h-16 rounded-lg bg-sand-${weight} shadow-inner`}></div>
                  <span className="text-xs text-earth-500 mt-2 font-mono">{weight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UI Elements Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100">
        <h2 className="text-2xl font-display font-bold text-earth-800 mb-8 border-b pb-2">Components & Animations</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Buttons */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-earth-800">Buttons</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
            </div>
            
            <p className="text-sm text-earth-500 mt-4">
              Try hovering over these! 
            </p>
          </div>

          {/* Cards & Animation */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-earth-800">Cards & Animations</h3>
            <div className="card p-6 border border-earth-100 hover:border-ochre-300">
              <div className="w-12 h-12 bg-sunset-100 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
                ✨
              </div>
              <h4 className="text-xl font-bold text-earth-950 mb-2">Dreamtime Card</h4>
              <p className="text-earth-600 font-body text-sm mb-4">
                This card uses the <code>.card</code> class. Notice the hover elevation and the gentle pulse animation on the icon above.
              </p>
              <a href="#" className="font-bold text-ochre-600 hover:text-ochre-800 transition-colors">Learn more &rarr;</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gradients & Backgrounds Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold text-earth-800 mb-8 border-b pb-2">Gradients & Textures</h2>
          
          <div className="p-12 rounded-2xl bg-gradient-to-br from-ochre-900 via-earth-900 to-eucalyptus-900 text-center shadow-xl">
             <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-ochre-300 to-sunset-300 mb-4 animate-slide-up">
               Modern Premium Feel
             </h2>
             <p className="text-sand-100 font-body max-w-xl mx-auto text-lg">
               Using gradients, soft blurs, and deep contrasts allows the storytelling elements to shine brighter.
             </p>
             <button className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-colors shadow-[0_0_20px_rgba(244,135,64,0.3)]">
               Glassmorphism Example
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandSandboxPage;
