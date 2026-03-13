import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  User, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Wrench
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/AuthContext'
import { cn } from '@/lib/utils'

/** Liens du dashboard */
const sidebarLinks = [
  { label: 'Aperçu', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Nouvelle demande', href: '/dashboard/new-request', icon: PlusCircle },
  { label: 'Mes demandes', href: '/dashboard/requests', icon: ClipboardList },
  { label: 'Mon profil', href: '/dashboard/profile', icon: User },
]

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-bg-card border-r border-border flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-300">
              <Wrench className="w-4 h-4 text-bg-primary" />
            </div>
            <span className="font-heading font-bold text-base tracking-tight">
              drone<span className="text-accent">fpv</span>builder
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-accent/10 text-accent shadow-sm" 
                    : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                )}
              >
                <link.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                )} />
                {link.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="p-3 bg-bg-secondary rounded-xl mb-4">
            <p className="text-xs text-text-muted uppercase tracking-widest font-heading mb-2">Connecté en tant que</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-error hover:bg-error/10 hover:text-error h-10 px-3"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-bg-card border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Wrench className="w-4 h-4 text-bg-primary" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight">
            drone<span className="text-accent">fpv</span>builder
          </span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-text-muted hover:text-text-primary"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed top-0 bottom-0 left-0 w-72 bg-bg-card z-[60] transform transition-transform duration-300 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <span className="font-heading font-bold text-base tracking-tight">Menü</span>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-text-muted hover:text-text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-error hover:bg-error/10 hover:text-error h-12"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col lg:pt-0 pt-16">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
