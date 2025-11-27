import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Dashboard } from '@/pages/Dashboard'

export default function DashboardPage() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('user')
  if (!userCookie || !userCookie.value) {
    redirect('/login')
  }

  return <Dashboard />
}
