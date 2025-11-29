const testimonials = [
  {
    quote: 'CyberSentinel has transformed how we manage our attack surface. The continuous discovery and prioritization saves us hours every week.',
    author: 'Sarah Chen',
    role: 'CISO',
    company: 'TechCorp',
  },
  {
    quote: 'The vulnerability scanning is incredibly accurate, and the remediation guidance is spot-on. Our security posture improved dramatically.',
    author: 'Michael Rodriguez',
    role: 'DevOps Lead',
    company: 'CloudScale',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Security Teams
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

