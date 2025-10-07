const Footer = () => {
  return (
    <footer className="bg-charcoal-black text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">OONCHIUMPA</h3>
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Traditional owners providing culturally-led youth services that transform 
              lives and strengthen community. Two cultures, one world, working together.
            </p>
            
            <div className="flex space-x-4">
              <div className="bg-primary/20 rounded-lg p-3">
                <div className="text-primary font-bold">100%</div>
                <div className="text-white/60 text-sm">Aboriginal Led</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-3">
                <div className="text-primary font-bold">8</div>
                <div className="text-white/60 text-sm">Language Groups</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-3">
                <div className="text-primary font-bold">87-95%</div>
                <div className="text-white/60 text-sm">Engagement</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Country & Story</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Young People</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Impact Data</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Three Horizons</a></li>
              <li><a href="#" className="text-white/80 hover:text-primary transition-colors">Connect</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <div>
                <div className="text-white/60 text-sm">Location</div>
                <div className="text-white/80">Mbantua (Alice Springs)</div>
                <div className="text-white/80">Central Australia</div>
              </div>
              
              <div>
                <div className="text-white/60 text-sm">Traditional Country</div>
                <div className="text-white/80">Arrernte Country</div>
              </div>
              
              <div>
                <div className="text-white/60 text-sm">Cultural Authority</div>
                <div className="text-white/80">Traditional Owners</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Acknowledgment */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="bg-gradient-to-r from-ochre-red/20 to-ochre-yellow/20 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold mb-3">Cultural Acknowledgment</h4>
            <p className="text-white/90 leading-relaxed">
              We acknowledge the Arrernte people as the traditional owners of Mbantua 
              and pay respect to Elders past, present and emerging. We recognize their 
              continuing connection to country, culture and community. Our work is 
              guided by cultural protocols and Elder wisdom.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 Oonchiumpa Consultancy & Services. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Cultural Protocols</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* NIAA Partnership */}
      <div className="bg-primary/10 border-t border-primary/20">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-white/80">
                <strong>NIAA Partnership:</strong> Working together to implement the Walker Inquest recommendations and build community-controlled solutions.
              </p>
            </div>
            <div className="text-primary font-semibold">
              Funded by the National Indigenous Australians Agency
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer