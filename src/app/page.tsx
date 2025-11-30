import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {LandingPage} from '@/app/LandingPage'

export default function DashboardPage() {

  return <LandingPage />
}
