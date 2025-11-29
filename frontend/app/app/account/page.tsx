import { DashboardLayout } from '@/components/app/dashboard-layout'

export default function AccountPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Account Settings
        </h1>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">
              Plan Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="text-lg font-semibold text-gray-900">Pro</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Usage</p>
                <p className="text-lg font-semibold text-gray-900">2,450 / 5,000 assets</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">
              API Keys
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Manage your API keys for programmatic access
            </p>
            <button className="px-4 py-2 bg-accent-indigo text-white rounded-lg font-medium hover:bg-primary-700">
              Generate New Key
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

