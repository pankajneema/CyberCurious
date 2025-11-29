import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

const posts = [
  {
    id: '1',
    title: 'Understanding Attack Surface Management',
    excerpt: 'Learn how ASM helps organizations discover and manage their external assets.',
    date: '2024-01-10',
  },
  {
    id: '2',
    title: 'Vulnerability Scanning Best Practices',
    excerpt: 'A guide to effective vulnerability scanning and prioritization.',
    date: '2024-01-05',
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-12">
            Knowledge Center
          </h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="card">
                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-sm font-medium text-accent-indigo hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

