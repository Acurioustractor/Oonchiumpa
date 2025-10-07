const YouthStories = () => {
  const stories = [
    {
      title: "Education Re-engagement Through Cultural Safety",
      description: "Three girls from Anthepe Camp found their way back to learning through Oonchiumpa's culturally-safe office space when excluded from mainstream school.",
      impact: "Maintained educational goals despite systemic barriers",
      quote: "The clients have attended most days, demonstrated strong educational goals, and remained committed to their studies in this supportive environment.",
      category: "Education"
    },
    {
      title: "Cultural Leadership and Identity Strengthening", 
      description: "A 16-year-old navigated Men's Ceremony and cultural obligations while developing independence and leadership skills through targeted mentoring.",
      impact: "Developed tools to manage peer pressure and become a role model",
      quote: "The Client was empowered to see leadership not as a burden but as an opportunity, developing tools to make decisions aligned with cultural values.",
      category: "Cultural Connection"
    },
    {
      title: "Trauma-Informed Healthcare Advocacy",
      description: "A 15-year-old with rheumatic heart disease hadn't received medical care since 2022. Through patient, culturally-informed support, she accessed essential healthcare.",
      impact: "First medical care in 3 years, growing trust in services",
      quote: "The Client's growing trust became evident on the day she finally completed her blood test, expressing thanks to Oonchiumpa staff who attended with her.",
      category: "Health & Wellbeing"
    }
  ]

  const testimonials = [
    {
      quote: "I think other kids should work with you mob",
      attribution: "Young person engaged with Oonchiumpa"
    },
    {
      quote: "We all green, we Oonchiumpa", 
      attribution: "Client expressing cultural connection"
    },
    {
      quote: "Its good stuff like this cause we get to work with people like you mob",
      attribution: "Youth reflecting on cultural support"
    }
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Young People's Stories
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Real transformation happens through relationship, respect, and cultural connection. 
            These stories show the power of Aboriginal-led, trauma-informed youth work.
          </p>
        </div>

        {/* Case Studies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <div key={index} className="bg-surface rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {story.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-text mb-4">{story.title}</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">{story.description}</p>
              
              <div className="bg-surface-variant rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-secondary mb-2">Impact:</h4>
                <p className="text-text-secondary text-sm">{story.impact}</p>
              </div>
              
              <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary">
                "{story.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Youth Testimonials */}
        <div className="bg-gradient-to-r from-spinifex-green to-mulga-green rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">In Their Own Words</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <blockquote className="text-lg italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-white/80 text-sm">— {testimonial.attribution}</cite>
              </div>
            ))}
          </div>
        </div>

        {/* Key Statistics from Stories */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <div className="text-text-secondary">Detailed Case Studies</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">247</div>
            <div className="text-text-secondary">Education Support Contacts</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">826</div>
            <div className="text-text-secondary">Basic Needs Support</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-text-secondary">Cultural Connection Focus</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default YouthStories