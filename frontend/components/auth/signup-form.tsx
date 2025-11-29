'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

const signupSchema = z
  .object({
    companyName: z.string().min(2, 'Company name is required'),
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    role: z.enum(['admin', 'analyst', 'reader']),
    country: z.string().min(2, 'Country is required'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const password = watch('password')

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return strength
  }

  const onSubmit = async (data: SignupFormData) => {
    // TODO: Implement API call
    console.log('Signup data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          {...register('companyName')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-accent-danger">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          {...register('fullName')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-accent-danger">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-accent-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => {
              register('password').onChange(e)
              setPasswordStrength(calculatePasswordStrength(e.target.value))
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded ${
                    level <= passwordStrength
                      ? 'bg-accent-indigo'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {errors.password && (
          <p className="mt-1 text-sm text-accent-danger">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            {...register('role')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
          >
            <option value="admin">Admin</option>
            <option value="analyst">Analyst</option>
            <option value="reader">Reader</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            {...register('country')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-indigo focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-start">
        <input
          {...register('acceptTerms')}
          type="checkbox"
          className="mt-1 mr-2"
        />
        <label className="text-sm text-gray-600">
          I accept the{' '}
          <Link href="/legal/terms" className="text-accent-indigo hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/legal/privacy" className="text-accent-indigo hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-accent-danger">
          {errors.acceptTerms.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-accent-indigo text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-indigo hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-gray-500">Or</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        Sign up with SSO (SAML/OIDC)
      </button>
    </form>
  )
}

