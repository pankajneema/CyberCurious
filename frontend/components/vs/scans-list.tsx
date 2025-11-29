'use client'

import { useState } from 'react'
import { Play, Clock, CheckCircle, XCircle } from 'lucide-react'

const mockScans = [
  {
    id: '1',
    name: 'External Scan - Production',
    target: 'api.example.com',
    lastRun: '2024-01-14 10:30',
    duration: '15m 32s',
    criticalFindings: 8,
    status: 'completed',
  },
  {
    id: '2',
    name: 'Full Scan - Internal Network',
    target: '192.168.1.0/24',
    lastRun: '2024-01-13 02:00',
    duration: '2h 15m',
    criticalFindings: 3,
    status: 'completed',
  },
  {
    id: '3',
    name: 'Scheduled Scan - Weekly',
    target: 'app.example.com',
    lastRun: 'Running...',
    duration: '-',
    criticalFindings: 0,
    status: 'running',
  },
]

export function ScansList() {
  const [selectedScan, setSelectedScan] = useState<string | null>(null)

  return (
    <div className="card">
      <div className="space-y-4">
        {mockScans.map((scan) => (
          <div
            key={scan.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-accent-indigo transition-colors cursor-pointer"
            onClick={() => setSelectedScan(scan.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{scan.name}</h3>
                  {scan.status === 'running' && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                      Running
                    </span>
                  )}
                  {scan.status === 'completed' && scan.criticalFindings > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                      {scan.criticalFindings} Critical
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Target: {scan.target}</div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last run: {scan.lastRun}</span>
                    </span>
                    <span>Duration: {scan.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {scan.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : scan.status === 'running' ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Play className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

