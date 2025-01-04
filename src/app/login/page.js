'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      // Specific handling for guest login
      if (email === 'guest@inventoryapp.com' && password === 'GuestViewOnly2024!') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'guest@inventoryapp.com',
          password: 'GuestViewOnly2024!'
        })

        console.log('Guest login detailed response:', { 
          data: {
            user: data?.user ? 'User exists' : 'No user',
            session: data?.session ? 'Session exists' : 'No session'
          }, 
          error 
        })

        if (error) {
          console.error('Detailed guest login error:', {
            message: error.message,
            status: error.status,
            code: error.code,
            details: error.details
          })
          setError(error.message || 'Guest login failed')
          return
        }

        router.push('/admin/dashboard')
        return
      }

      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        setError(error.message || 'Login failed')
        return
      }

      router.push('/admin/dashboard')
    } catch (err) {
      console.error('Unexpected login error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vehicle Inventory Login
          </h2>
        </div>
        
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}