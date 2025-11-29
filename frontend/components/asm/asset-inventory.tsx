'use client'

import { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'

const mockAssets = [
  {
    id: '1',
    type: 'domain',
    identifier: 'api.example.com',
    riskScore: 95,
    firstSeen: '2024-01-01',
    lastSeen: '2024-01-14',
    tags: ['production', 'api'],
  },
  {
    id: '2',
    type: 'ip',
    identifier: '192.168.1.100',
    riskScore: 88,
    firstSeen: '2024-01-05',
    lastSeen: '2024-01-14',
    tags: ['internal'],
  },
  {
    id: '3',
    type: 'cloud-resource',
    identifier: 's3-bucket-public',
    riskScore: 75,
    firstSeen: '2024-01-10',
    lastSeen: '2024-01-14',
    tags: ['aws', 'storage'],
  },
]

export function AssetInventory() {
  const [search, setSearch] = useState('')

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50'
    if (score < 60) return 'text-yellow-600 bg-yellow-50'
    if (score < 80) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Identifier
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Risk Score
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                First Seen
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Last Seen
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Tags
              </th>
            </tr>
          </thead>
          <tbody>
            {mockAssets.map((asset) => (
              <tr
                key={asset.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700 capitalize">
                    {asset.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-gray-900">
                    {asset.identifier}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${getRiskColor(
                      asset.riskScore
                    )}`}
                  >
                    {asset.riskScore}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{asset.firstSeen}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-600">{asset.lastSeen}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

