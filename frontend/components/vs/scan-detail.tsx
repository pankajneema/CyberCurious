'use client'

import { X } from 'lucide-react'

interface ScanDetailProps {
  scanId: string | null
  isOpen: boolean
  onClose: () => void
}

export function ScanDetail({ scanId, isOpen, onClose }: ScanDetailProps) {
  if (!isOpen || !scanId) return null

  const vulnerabilities = [
    {
      cve: 'CVE-2024-0001',
      severity: 'Critical',
      exploitabilityScore: 9.8,
      description: 'Remote code execution vulnerability',
      remediation: 'Update to version 2.0.1',
    },
    {
      cve: 'CVE-2024-0002',
      severity: 'High',
      exploitabilityScore: 7.5,
      description: 'SQL injection vulnerability',
      remediation: 'Apply patch from vendor',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Scan Results</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-80px)]">
          {vulnerabilities.map((vuln, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{vuln.cve}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    vuln.severity === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {vuln.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{vuln.description}</p>
              <div className="text-xs text-gray-500 mb-2">
                Exploitability Score: {vuln.exploitabilityScore}/10
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Remediation: </span>
                <span className="text-gray-600">{vuln.remediation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

