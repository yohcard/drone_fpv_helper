import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminHome from './AdminHome'
import AdminRequests from './AdminRequests'
import AdminRequestDetail from './AdminRequestDetail'

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/requests" element={<AdminRequests />} />
        <Route path="/requests/:id" element={<AdminRequestDetail />} />
        
        {/* Placeholders pour les autres sections admin */}
        <Route path="/clients" element={
          <div className="animate-fade-in py-10 text-center">
            <h1 className="text-4xl font-black italic uppercase italic tracking-tighter mb-4">Base de données <span className="text-accent">Clients</span></h1>
            <p className="text-text-muted font-medium">Gestion des comptes et historiques de maintenance en développement...</p>
          </div>
        } />
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
