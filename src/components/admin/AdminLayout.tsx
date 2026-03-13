import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  Files, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  PackageSearch
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import { cn } from '@/lib/utils'

/** Liens de navigation admin */
const adminLinks = [
  { label: 'Vue d\'ensemble', href: '/admin', icon: BarChart3 },
  { label: 'Toutes les demandes', href: '/admin/requests', icon: Files },
  { label: 'Gestion Clients', href: '/admin/clients', icon: Users },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#050505] flex text-text-primary">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-bg-card border-r border-accent/10 flex-col sticky top-0 h-screen shadow-2xl shadow-accent/5">
        <div className="p-8">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-bg-primary" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight block leading-none">
                drone<span className="text-accent">fpv</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <p className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4">Management</p>
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-accent bg-accent/5" 
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                )}
              >
                {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent rounded-r-full" />}
                <link.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                )} />
                {link.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-bg-primary flex items-center justify-center text-sm font-black shadow-inner">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-accent font-mono truncate uppercase tracking-tighter">Technicien Autorisé</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-error hover:bg-error/10 hover:text-error h-12 px-4 rounded-xl transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-bg-card border-b border-white/5 z-40 flex items-center justify-between px-6 shadow-xl">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-bg-primary" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight block leading-none">
            drone<span className="text-accent">fpv</span> Admin
          </span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 bg-white/5 rounded-xl text-text-muted hover:text-text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed top-0 bottom-0 left-0 w-80 bg-bg-card z-[60] transform transition-transform duration-500 ease-out flex flex-col border-r border-white/10",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <span className="font-heading font-bold text-lg">Menu Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white/5 rounded-lg text-text-muted hover:text-text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-6 py-8 space-y-2">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200",
                  isActive 
                    ? "bg-accent text-bg-primary shadow-lg shadow-accent/20" 
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                )}
              >
                <link.icon className="w-6 h-6" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-error hover:bg-error/10 hover:text-error h-14 rounded-2xl"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6 mr-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col lg:pt-0 pt-20">
        <header className="hidden lg:flex h-20 border-b border-white/5 items-center justify-between px-10 bg-bg-card/30 backdrop-blur-sm sticky top-0 z-30">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted">Système de Maintenance Centralisé</h2>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 rounded-full border border-success/20">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">Serveur Opérationnel</span>
             </div>
             <button className="relative p-2 text-text-muted hover:text-accent transition-colors">
                <PackageSearch className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border-2 border-bg-card" />
             </button>
          </div>
        </header>
        <div className="flex-1 px-6 sm:px-10 py-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
