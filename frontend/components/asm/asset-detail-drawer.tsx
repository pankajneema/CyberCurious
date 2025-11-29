'use client'

import { X } from 'lucide-react'

interface AssetDetailDrawerProps {
  asset: {
    id: string
    type: string
    identifier: string
    riskScore: number
    firstSeen: string
    lastSeen: string
    tags: string[]
  } | null
  isOpen: boolean
  onClose: () => void
}

export function AssetDetailDrawer({ asset, isOpen, onClose }: AssetDetailDrawerProps) {
  if (!isOpen || !asset) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Asset Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Identifier</h3>
            <p className="text-lg font-semibold text-gray-900">{asset.identifier}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
            <p className="text-gray-900 capitalize">{asset.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h3>
            <p className="text-2xl font-bold text-red-600">{asset.riskScore}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">First Seen</h3>
            <p className="text-gray-900">{asset.firstSeen}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Last Seen</h3>
            <p className="text-gray-900">{asset.lastSeen}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

