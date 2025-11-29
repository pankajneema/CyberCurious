import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ASMWorkspace() {
  const metrics = {
    discoveredAssets: 1247,
    exposedServices: 89,
    newlyAdded: 12,
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900">
            ASM — Active
          </h3>
          <p className="text-sm text-gray-500">Attack Surface Management</p>
        </div>
        <Link
          href="/app/asm"
          className="text-sm font-medium text-accent-indigo hover:underline flex items-center"
        >
          Go to ASM <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-2xl font-display font-bold text-gray-900">
            {metrics.discoveredAssets.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Discovered Assets</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-gray-900">
            {metrics.exposedServices}
          </div>
          <div className="text-sm text-gray-600">Exposed Services</div>
        </div>
        <div>
          <div className="text-2xl font-display font-bold text-accent-indigo">
            +{metrics.newlyAdded}
          </div>
          <div className="text-sm text-gray-600">Newly Added (24h)</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-500 mb-2">Service Distribution</div>
        <div className="flex space-x-2">
          {['Web', 'SSH', 'FTP', 'RDP'].map((service) => (
            <div
              key={service}
              className="flex-1 bg-white rounded p-2 text-center text-sm font-medium"
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

