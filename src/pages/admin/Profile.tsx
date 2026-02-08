import { AdminLayout } from '@/components/admin/AdminLayout'
import UserProfile from '@/components/UserProfile'
import React from 'react'

export default function Profile() {
  return (
    <AdminLayout 
      title="Profile"
      subtitle="Manage your profile and account settings."
    >
        <UserProfile></UserProfile>
    </AdminLayout>
  )
}
