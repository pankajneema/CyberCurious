import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">
            About CuriousDevs
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              CuriousDevs is a team of security engineers and developers passionate about
              making cybersecurity accessible and actionable for organizations of all sizes.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              We believe that every organization deserves enterprise-grade security tools
              without the complexity. CyberSentinel was built to democratize attack surface
              management and vulnerability scanning, making it easy for teams to identify,
              prioritize, and remediate security risks.
            </p>
            <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">
              The Team
            </h2>
            <p className="text-gray-600">
              Our team combines decades of experience in cybersecurity, cloud infrastructure,
              and software development. We're committed to building tools that security teams
              actually want to use.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

