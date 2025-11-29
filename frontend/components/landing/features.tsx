import Link from 'next/link'
import {
  Search,
  Shield,
  Zap,
  AlertTriangle,
  FileSearch,
  Settings,
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Attack Surface Management',
    description: 'Continuously discover all your external & cloud assets and prioritize exposures.',
    status: 'available',
    cta: 'Try ASM',
    href: '/signup',
  },
  {
    icon: Shield,
    title: 'Vulnerability Scanning',
    description: 'High-fidelity vulnerability scanning with contextual prioritization and remediation guidance.',
    status: 'available',
    cta: 'Try VS',
    href: '/signup',
  },
  {
    icon: Zap,
    title: 'Breach & Attack Simulation',
    description: 'Automated adversary emulation to test your defenses continuously.',
    status: 'coming-soon',
    cta: 'Request Demo',
    href: '/contact',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Intelligence',
    description: 'Real-time threat feeds and IOC correlation across your infrastructure.',
    status: 'coming-soon',
    cta: 'Request Demo',
    href: '/contact',
  },
  {
    icon: FileSearch,
    title: 'Incident Response Orchestration',
    description: 'Automated playbooks and response workflows for security incidents.',
    status: 'coming-soon',
    cta: 'Request Demo',
    href: '/contact',
  },
  {
    icon: Settings,
    title: 'Compliance & Audit',
    description: 'Automated compliance checks and audit reports for SOC2, GDPR, and more.',
    status: 'coming-soon',
    cta: 'Request Demo',
    href: '/contact',
  },
]

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Security Modules
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage cyber risk in one unified platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            const isAvailable = feature.status === 'available'

            return (
              <div
                key={feature.title}
                className="card card-hover relative overflow-hidden"
              >
                {!isAvailable && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isAvailable
                      ? 'gradient-primary'
                      : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isAvailable ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  href={feature.href}
                  className={`inline-flex items-center text-sm font-medium ${
                    isAvailable
                      ? 'text-accent-indigo hover:text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {feature.cta} →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

