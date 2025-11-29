import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: January 2024
            </p>
            <p className="text-gray-600 mb-6">
              CyberSentinel takes your privacy and security seriously. This Privacy Policy
              describes how we collect, use, and protect your information.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-6">
              We collect information that you provide directly to us, such as when you create
              an account, use our services, or contact us for support.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-6">
              We use the information we collect to provide, maintain, and improve our services,
              process transactions, and communicate with you.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              Data Security
            </h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

