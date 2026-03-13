import { Link } from 'react-router-dom'
import { Wrench, Mail, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

/** Footer du site */
export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Wrench className="w-5 h-5 text-bg-primary" />
              </div>
              <span className="font-heading font-bold text-lg">
                drone<span className="text-accent">fpv</span>builder
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              Service professionnel de réparation et montage de drones FPV. 
              Intervention à domicile, pièces de qualité, technicien passionné.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-text-muted">
              Navigation
            </h3>
            <nav className="space-y-2">
              <a href="/#services" className="block text-sm text-text-muted hover:text-accent transition-colors">Services</a>
              <a href="/#process" className="block text-sm text-text-muted hover:text-accent transition-colors">Comment ça marche</a>
              <a href="/#testimonials" className="block text-sm text-text-muted hover:text-accent transition-colors">Témoignages</a>
              <a href="/#contact" className="block text-sm text-text-muted hover:text-accent transition-colors">Contact</a>
              <Link to="/login" className="block text-sm text-text-muted hover:text-accent transition-colors">Mon espace</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-text-muted">
              Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:support@dronefpvbuilder.shop"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@dronefpvbuilder.shop
              </a>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="w-4 h-4" />
                Suisse
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright et mentions légales */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} dronefpvbuilder.shop — Tous droits réservés</p>
          <div className="flex gap-4">
            <Link to="/mentions-legales" className="hover:text-accent transition-colors">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="hover:text-accent transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
