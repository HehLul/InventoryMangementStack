import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchInventory } from '@/lib/supabase'
import DashboardClient from './DashboardClient'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const inventory = await fetchInventory()

  return <DashboardClient initialInventory={inventory} userEmail={user.email} />
}