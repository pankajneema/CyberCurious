'use client'

export function RiskScoreCard() {
  const riskScore = 72 // Mock data
  const trend = [65, 68, 70, 72, 72] // Mock trend data

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600'
    if (score < 60) return 'text-yellow-600'
    if (score < 80) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low'
    if (score < 60) return 'Medium'
    if (score < 80) return 'High'
    return 'Critical'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-gray-900">
            Company Risk Score
          </h2>
          <p className="text-sm text-gray-500">Last updated 2 hours ago</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-accent-indigo hover:bg-primary-50 rounded-lg">
          Run ASM Scan
        </button>
      </div>

      <div className="flex items-end space-x-8">
        <div>
          <div className={`text-5xl font-display font-bold ${getRiskColor(riskScore)}`}>
            {riskScore}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Risk Level: <span className="font-medium">{getRiskLabel(riskScore)}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-2">Trend (last 7 days)</div>
          <div className="flex items-end space-x-1 h-16">
            {trend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-accent-indigo to-accent-electric rounded-t"
                style={{ height: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

