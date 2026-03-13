import { useState } from 'react'
import {
  Wrench,
  Cpu,
  Home,
  MessageSquare,

  CheckCircle,
  Send,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

/* ─────────────────────────────────────────────
   Données statiques (mockées)
   ───────────────────────────────────────────── */

/** Services proposés */
const services = [
  {
    icon: Wrench,
    title: 'Réparation FPV',
    description:
      'Diagnostic et réparation de tous les composants : moteurs, ESC, FC, VTX, caméra, frame. Pièces de qualité.',
  },
  {
    icon: Cpu,
    title: 'Montage sur mesure',
    description:
      'Construction complète de votre drone FPV selon vos specs. Du choix des composants au premier vol.',
  },
  {
    icon: Home,
    title: 'Dépannage à domicile',
    description:
      'Je me déplace directement chez vous en Suisse. Pas besoin d\'envoyer votre drone par la poste.',
  },
]

/** Étapes du processus */
const steps = [
  {
    number: '01',
    title: 'Décris ta panne',
    description: 'Remplis le formulaire en décrivant le problème ou le montage souhaité. Ajoute des photos si possible.',
  },
  {
    number: '02',
    title: 'Je me déplace',
    description: 'On fixe un rendez-vous et je viens chez toi avec tout le matériel nécessaire.',
  },
  {
    number: '03',
    title: 'Drone réparé',
    description: 'Réparation sur place, test de vol, et ton drone repart en l\'air. Simple et rapide.',
  },
]



/* ─────────────────────────────────────────────
   Composant Landing Page
   ───────────────────────────────────────────── */

export default function Landing() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <ContactSection />
    </div>
  )
}

/* ────── Hero ────── */

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Fond avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08),transparent_60%)]" />

      {/* Grille décorative subtile */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,245,245,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-bg-card/50 text-xs text-text-muted mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Disponible en Suisse
        </div>

        {/* Titre principal */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in delay-100">
          Votre expert{' '}
          <span className="text-accent">drone FPV</span>
          <br />
          à domicile
        </h1>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 animate-fade-in delay-200">
          Réparation, diagnostic et montage de drones FPV. 
          Je me déplace chez vous avec tout le matériel nécessaire.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
          <Button size="lg" className="animate-pulse-glow text-base px-8" asChild>
            <a href="#contact">
              Déposer une demande
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="text-base" asChild>
            <a href="#services">Voir les services</a>
          </Button>
        </div>

        {/* Tarif */}
        <p className="mt-8 text-sm text-text-muted animate-fade-in delay-400">
          À partir de <span className="text-accent font-semibold">25 CHF / 30 min</span> · Devis personnalisé si nécessaire
        </p>
      </div>

      {/* Flèche vers le bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-border flex justify-center pt-2">
          <div className="w-1 h-3 bg-text-muted rounded-full" />
        </div>
      </div>
    </section>
  )
}

/* ────── Services ────── */

function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <p className="text-accent font-heading text-sm font-bold uppercase tracking-widest mb-3">
            Services
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Ce que je propose
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Un service complet pour tous vos besoins en drones FPV, du diagnostic à la livraison.
          </p>
        </div>

        {/* Cartes services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Card
              key={service.title}
              className="group hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────── Process ────── */

function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-accent font-heading text-sm font-bold uppercase tracking-widest mb-3">
            Comment ça marche
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            3 étapes simples
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Un processus simple et transparent de A à Z.
          </p>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Ligne de connexion (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-accent/40 to-transparent" />
              )}

              {/* Numéro */}
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
                <span className="font-heading text-2xl font-bold text-accent">
                  {step.number}
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────── Contact ────── */

function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  /** Gestion de la soumission du formulaire */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: envoyer au backend (Phase 3)
    toast.success('Message envoyé !', {
      description: 'Nous vous recontacterons sous 24h.'
    })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-24 bg-bg-secondary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <p className="text-accent font-heading text-sm font-bold uppercase tracking-widest mb-3">
            Contact
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Une question ? Un projet ?
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Décrivez votre besoin et je vous recontacte rapidement.
          </p>
        </div>

        {/* Formulaire */}
        <Card className="border-border/50">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-text-muted">
                    Nom
                  </label>
                  <Input
                    id="contact-name"
                    placeholder="Votre nom"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-text-muted">
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="votre@email.ch"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-text-muted">
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  placeholder="Décrivez votre panne, votre projet de montage, ou posez simplement une question…"
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">
                  Réponse sous 24h en général
                </p>
                <Button type="submit" disabled={submitted}>
                  {submitted ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Envoyé !
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info tarif */}
        <div className="mt-8 text-center">
          <Card className="inline-flex items-center gap-3 px-6 py-3 border-accent/20 bg-accent/5">
            <MessageSquare className="w-5 h-5 text-accent" />
            <span className="text-sm">
              <span className="font-semibold text-accent">25 CHF / 30 min</span>
              <span className="text-text-muted"> · Devis personnalisé pour les montages</span>
            </span>
          </Card>
        </div>
      </div>
    </section>
  )
}
