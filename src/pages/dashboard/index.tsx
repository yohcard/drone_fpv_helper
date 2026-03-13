import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DashboardHome from './DashboardHome'
import NewRequest from './NewRequest'
import RequestsList from './RequestsList'
import RequestDetail from './RequestDetail'
import Profile from './Profile'

export default function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/requests" element={<RequestsList />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
