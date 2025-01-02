// in src/app/components/auth/ProtectedRoute.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProtectedRoute({ children }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && window.location.pathname !== '/login') {
        router.push('/login')
      }
    }
    checkAuth()
  }, [])

  return <>{children}</>
}