import { useState } from 'react'
import './styles/globals.css'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Impact from './components/Impact'
import ThreeHorizons from './components/ThreeHorizons'
import YouthStories from './components/YouthStories'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main>
        {activeSection === 'home' && (
          <>
            <Hero />
            <Impact />
            <YouthStories />
            <ThreeHorizons />
          </>
        )}
        
        {activeSection === 'country' && (
          <div className="container py-24">
            <h1>Country & Story</h1>
            <p>Traditional ownership, cultural authority, and our connection to country.</p>
          </div>
        )}
        
        {activeSection === 'youth' && (
          <div className="container py-24">
            <h1>Young People</h1>
            <p>Stories of transformation, growth, and cultural connection.</p>
          </div>
        )}
        
        {activeSection === 'impact' && (
          <div className="container py-24">
            <h1>Impact</h1>
            <p>Evidence-based results and community outcomes.</p>
          </div>
        )}
        
        {activeSection === 'horizons' && (
          <div className="container py-24">
            <h1>Three Horizons</h1>
            <p>Our strategic vision for transformational change.</p>
          </div>
        )}
        
        {activeSection === 'connect' && (
          <div className="container py-24">
            <h1>Connect</h1>
            <p>Partnership opportunities and ways to get involved.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App
