import { DashboardLayout } from '@/components/app/dashboard-layout'
import { ScansList } from '@/components/vs/scans-list'

export default function VSPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Vulnerability Scanning
            </h1>
            <p className="text-gray-600 mt-1">
              Run and manage vulnerability scans
            </p>
          </div>
          <button className="px-4 py-2 bg-accent-indigo text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            + New Scan
          </button>
        </div>

        <ScansList />
      </div>
    </DashboardLayout>
  )
}

