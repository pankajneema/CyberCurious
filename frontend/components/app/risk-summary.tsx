export function RiskSummary() {
  const risks = [
    { severity: 'Critical', count: 12, color: 'bg-red-500' },
    { severity: 'High', count: 34, color: 'bg-orange-500' },
    { severity: 'Medium', count: 67, color: 'bg-yellow-500' },
    { severity: 'Low', count: 123, color: 'bg-green-500' },
  ]

  const topAssets = [
    { name: 'api.example.com', risk: 95 },
    { name: '192.168.1.100', risk: 88 },
    { name: 'app.example.com', risk: 82 },
    { name: 'db.internal', risk: 75 },
    { name: 'cdn.example.com', risk: 68 },
  ]

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
        Risk Summary
      </h3>

      <div className="space-y-3 mb-6">
        {risks.map((risk) => (
          <div key={risk.severity} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${risk.color}`} />
              <span className="text-sm text-gray-700">{risk.severity}</span>
            </div>
            <span className="font-semibold text-gray-900">{risk.count}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Top 5 Assets at Risk
        </h4>
        <div className="space-y-2">
          {topAssets.map((asset, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <span className="text-sm text-gray-700">{asset.name}</span>
              <span className="text-sm font-medium text-red-600">{asset.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

