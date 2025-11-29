import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Features } from '@/components/landing/features'

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive cybersecurity modules designed to protect your organization
            </p>
          </div>
          <Features />
        </div>
      </main>
      <Footer />
    </>
  )
}

