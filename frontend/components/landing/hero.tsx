'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Unified Cyber Risk Orchestration —{' '}
              <span className="gradient-text">Predict. Test. Remediate.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-balance">
              CyberSentinel combines ASM, automated vulnerability scanning,
              adversary emulation, and compliance automation into a single
              cockpit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent-indigo text-white rounded-lg font-medium hover:bg-primary-700 transition-all hover:shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact?demo=true"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-accent-indigo border-2 border-accent-indigo rounded-lg font-medium hover:bg-primary-50 transition-all"
              >
                Request Demo
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Start free for 14 days — no credit card required
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-10 rounded-2xl blur-3xl transform rotate-6" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-lg p-4 h-24"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

