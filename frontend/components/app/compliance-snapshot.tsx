const frameworks = [
  { name: 'SOC 2', progress: 85 },
  { name: 'GDPR', progress: 72 },
  { name: 'ISO 27001', progress: 60 },
]

export function ComplianceSnapshot() {
  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
        Compliance & Audit
      </h3>

      <div className="space-y-4">
        {frameworks.map((framework) => (
          <div key={framework.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {framework.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {framework.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-accent-indigo to-accent-electric h-2 rounded-full transition-all"
                style={{ width: `${framework.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

