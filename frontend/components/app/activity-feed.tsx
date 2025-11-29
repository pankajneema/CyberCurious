import { Scan, User, Shield } from 'lucide-react'

const activities = [
  {
    type: 'scan',
    message: 'ASM discovery completed',
    timestamp: '2 hours ago',
    icon: Scan,
  },
  {
    type: 'user',
    message: 'John Doe assigned task #123',
    timestamp: '4 hours ago',
    icon: User,
  },
  {
    type: 'vulnerability',
    message: '8 new critical vulnerabilities found',
    timestamp: '6 hours ago',
    icon: Shield,
  },
]

export function ActivityFeed() {
  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
        Activity Feed
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1 p-2 bg-primary-50 rounded-lg">
                <Icon className="w-4 h-4 text-accent-indigo" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

