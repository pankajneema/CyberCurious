import Link from 'next/link'
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react'

export function VSPanel() {
  const lastScan = {
    status: 'completed',
    criticalVulns: 8,
    nextScheduled: '2024-01-15 02:00 UTC',
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-gray-900">
            Vulnerability Scanning
          </h3>
          <p className="text-sm text-gray-500">Last scan status</p>
        </div>
        <Link
          href="/app/vs"
          className="text-sm font-medium text-accent-indigo hover:underline flex items-center"
        >
          Go to VS <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          {lastScan.status === 'completed' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-medium text-gray-900">
            Last scan: {lastScan.status === 'completed' ? 'Passed' : 'Failed'}
          </span>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm font-semibold text-red-900 mb-1">
            {lastScan.criticalVulns} Critical Vulnerabilities
          </div>
          <div className="text-xs text-red-700">
            Requires immediate attention
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Next scheduled scan: <span className="font-medium">{lastScan.nextScheduled}</span>
        </div>
      </div>
    </div>
  )
}

