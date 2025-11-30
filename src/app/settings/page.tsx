import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SettingsPage } from '@/app/settings/Settings'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  if (!userCookie || !userCookie.value) {
    redirect('/login')
  }
  return <SettingsPage />
}
