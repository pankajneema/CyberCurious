import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: January 2024
            </p>
            <p className="text-gray-600 mb-6">
              Please read these Terms of Service carefully before using CyberSentinel.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 mb-6">
              By accessing or using CyberSentinel, you agree to be bound by these Terms of Service.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              Use of Service
            </h2>
            <p className="text-gray-600 mb-6">
              You may use our service only for lawful purposes and in accordance with these Terms.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              Subscription and Billing
            </h2>
            <p className="text-gray-600 mb-6">
              Subscriptions are billed in advance on a monthly or annual basis. You may cancel
              your subscription at any time.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

