import { DashboardLayout } from '@/components/app/dashboard-layout'
import { Search, Shield, Zap, AlertTriangle, FileSearch, Settings } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: Search,
    title: 'Attack Surface Management',
    status: 'available',
    description: 'Continuously discover and manage all your external assets.',
  },
  {
    icon: Shield,
    title: 'Vulnerability Scanning',
    status: 'available',
    description: 'High-fidelity vulnerability scanning with prioritization.',
  },
  {
    icon: Zap,
    title: 'Breach & Attack Simulation',
    status: 'coming-soon',
    description: 'Automated adversary emulation.',
  },
  {
    icon: AlertTriangle,
    title: 'Threat Intelligence',
    status: 'coming-soon',
    description: 'Real-time threat feeds and IOC correlation.',
  },
  {
    icon: FileSearch,
    title: 'Incident Response Orchestration',
    status: 'coming-soon',
    description: 'Automated playbooks and response workflows.',
  },
  {
    icon: Settings,
    title: 'Compliance & Audit',
    status: 'coming-soon',
    description: 'Automated compliance checks and audit reports.',
  },
]

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Services
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            const isAvailable = service.status === 'available'
            return (
              <div key={service.title} className="card relative">
                {!isAvailable && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    isAvailable ? 'gradient-primary' : 'bg-gray-100'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isAvailable ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {isAvailable ? (
                  <Link
                    href={service.title === 'Attack Surface Management' ? '/app/asm' : '/app/vs'}
                    className="text-sm font-medium text-accent-indigo hover:underline"
                  >
                    Open →
                  </Link>
                ) : (
                  <button className="text-sm font-medium text-gray-500">
                    Request Demo →
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

