import { DashboardLayout } from '@/components/app/dashboard-layout'

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Reports
        </h1>
        <div className="card text-center py-12">
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">
            Security Reports
          </h2>
          <p className="text-gray-600 mb-6">
            Generate and download security reports
          </p>
          <p className="text-sm text-gray-500">
            Coming soon
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

