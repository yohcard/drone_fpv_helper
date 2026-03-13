import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminHome from './AdminHome'
import AdminRequests from './AdminRequests'
import AdminRequestDetail from './AdminRequestDetail'
import AdminInvoice from './AdminInvoice'
import AdminClients from './AdminClients'
import AdminClientDetail from './AdminClientDetail'

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/requests" element={<AdminRequests />} />
        <Route path="/requests/:id" element={<AdminRequestDetail />} />
        <Route path="/requests/:id/invoice" element={<AdminInvoice />} />
        
        <Route path="/clients" element={<AdminClients />} />
        <Route path="/clients/:id" element={<AdminClientDetail />} />
        <Route path="/settings" element={
          <div className="animate-fade-in py-10 text-center">
            <h1 className="text-4xl font-black italic uppercase italic tracking-tighter mb-4">Paramètres <span className="text-accent">Système</span></h1>
            <p className="text-text-muted font-medium">Configuration des tarifs, services et notifications en développement...</p>
          </div>
        } />
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
