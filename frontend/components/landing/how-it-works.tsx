import { Search, TestTube, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Automatically discover all external assets, cloud resources, and exposed services across your infrastructure.',
  },
  {
    icon: TestTube,
    title: 'Test',
    description: 'Run continuous vulnerability scans and adversary simulations to identify weaknesses before attackers do.',
  },
  {
    icon: CheckCircle,
    title: 'Remediate',
    description: 'Get prioritized remediation tasks with step-by-step guidance and automated verification of fixes.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple three-step process to secure your attack surface
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-accent-indigo mb-2">
                  Step {index + 1}
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

