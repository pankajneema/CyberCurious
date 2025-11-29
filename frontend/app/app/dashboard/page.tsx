import { DashboardLayout } from '@/components/app/dashboard-layout'
import { RiskScoreCard } from '@/components/app/risk-score-card'
import { RiskSummary } from '@/components/app/risk-summary'
import { ASMWorkspace } from '@/components/app/asm-workspace'
import { VSPanel } from '@/components/app/vs-panel'
import { RemediationQueue } from '@/components/app/remediation-queue'
import { ComplianceSnapshot } from '@/components/app/compliance-snapshot'
import { ActivityFeed } from '@/components/app/activity-feed'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>

        <RiskScoreCard />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RiskSummary />
          </div>
          <div className="lg:col-span-2">
            <ASMWorkspace />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <VSPanel />
          <RemediationQueue />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ComplianceSnapshot />
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  )
}

