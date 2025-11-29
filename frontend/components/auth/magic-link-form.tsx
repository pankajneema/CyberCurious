'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type MagicLinkFormData = z.infer<typeof magicLinkSchema>

export function MagicLinkForm() {
  const [isSent, setIsSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  })

  const onSubmit = async (data: MagicLinkFormData) => {
    // TODO: Implement API call
    console.log('Magic link request:', data)
    setIsSent(true)
  }

  if (isSent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
        <p className="text-gray-600">
          We've sent a magic link to your email. Click it to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-accent-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-accent-indigo text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Magic Link'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        We'll send you a secure link to sign in without a password.
      </p>
    </form>
  )
}

