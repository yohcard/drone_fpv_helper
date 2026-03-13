import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Wrench, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

/** Liens de navigation */
const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Comment ça marche', href: '/#process' },
  { label: 'Contact', href: '/#contact' },
]

/** Header principal avec navigation responsive */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/30 transition-all duration-300">
              <Wrench className="w-5 h-5 text-bg-primary" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight hidden sm:block">
              drone<span className="text-accent">fpv</span>builder
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-text-muted hover:text-text-primary transition-colors duration-200 rounded-lg hover:bg-bg-card"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-accent/10 text-accent font-heading">
                        {user?.firstName?.[0] || '?'}{user?.lastName?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-bg-card border-border text-text-primary" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-text-muted">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild className="focus:bg-bg-secondary focus:text-text-primary">
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Tableau de bord</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild className="focus:bg-bg-secondary focus:text-accent">
                      <Link to="/admin" className="cursor-pointer">
                        <Wrench className="mr-2 h-4 w-4" />
                        <span>Administration</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="focus:bg-bg-secondary focus:text-text-primary">
                    <Link to="/dashboard/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    className="text-error focus:bg-error/10 focus:text-error cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Créer un compte</Link>
                </Button>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-border bg-bg-primary/95 backdrop-blur-xl",
          mobileMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium">{user?.firstName || ''} {user?.lastName || ''}</p>
                  <p className="text-xs text-text-muted">{user?.email || ''}</p>
                </div>
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </Link>
                </Button>
                {user.role === 'ADMIN' && (
                  <Button variant="outline" className="w-full justify-start border-accent/30 text-accent" size="sm" asChild>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Wrench className="mr-2 h-4 w-4" />
                      Administration
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" className="w-full justify-start text-error hover:bg-error/10" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                </Button>
                <Button className="w-full" size="sm" asChild>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Créer un compte</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
