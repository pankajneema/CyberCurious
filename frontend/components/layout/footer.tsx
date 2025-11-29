import Link from 'next/link'

const footerLinks = {
  Product: [
    { href: '/services', label: 'Services' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/features', label: 'Features' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg" />
              <span className="font-display font-bold text-xl text-white">
                CyberSentinel
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Unified Cyber Risk Orchestration by CuriousDevs
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} CuriousDevs. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-4 sm:mt-0">
            CyberSentinel takes your privacy and security seriously.{' '}
            <Link href="/legal/privacy" className="underline hover:text-white">
              See our Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

