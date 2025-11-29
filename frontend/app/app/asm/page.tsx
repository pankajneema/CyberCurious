import { DashboardLayout } from '@/components/app/dashboard-layout'
import { AssetInventory } from '@/components/asm/asset-inventory'

export default function ASMPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Attack Surface Management
            </h1>
            <p className="text-gray-600 mt-1">
              Discover and manage all your external assets
            </p>
          </div>
          <button className="px-4 py-2 bg-accent-indigo text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Discover Now
          </button>
        </div>

        <AssetInventory />
      </div>
    </DashboardLayout>
  )
}

