import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

const tasks = [
  {
    id: '1',
    title: 'Update OpenSSL on api.example.com',
    priority: 'Critical',
    assignedTo: 'John Doe',
    status: 'open',
  },
  {
    id: '2',
    title: 'Close port 3389 on 192.168.1.100',
    priority: 'High',
    assignedTo: null,
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Fix CVE-2024-0001 on app.example.com',
    priority: 'High',
    assignedTo: 'Jane Smith',
    status: 'open',
  },
]

export function RemediationQueue() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-gray-900">
          Remediation Queue
        </h3>
        <button className="text-sm font-medium text-accent-indigo hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div className="mt-1">
              {task.status === 'open' && (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              {task.status === 'in_progress' && (
                <Clock className="w-5 h-5 text-blue-500" />
              )}
              {task.status === 'closed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {task.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              {task.assignedTo && (
                <div className="text-xs text-gray-500">
                  Assigned to {task.assignedTo}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-accent-indigo border border-accent-indigo rounded-lg hover:bg-primary-50 transition-colors">
        Create Jira Ticket
      </button>
    </div>
  )
}

