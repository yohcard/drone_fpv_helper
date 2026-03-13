import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Variantes du composant Badge */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-bg-primary",
        secondary: "border-transparent bg-bg-card text-text-primary",
        destructive: "border-transparent bg-error text-text-primary",
        outline: "text-text-primary border-border",
        // Statuts personnalisés pour les demandes
        recu: "border-transparent bg-gray-600 text-text-primary",
        diagnostic: "border-transparent bg-blue-600 text-text-primary",
        en_attente_pieces: "border-transparent bg-yellow-600 text-bg-primary",
        en_reparation: "border-transparent bg-accent text-bg-primary",
        termine: "border-transparent bg-success text-bg-primary",
        livre: "border-transparent bg-green-800 text-text-primary",
        annule: "border-transparent bg-error text-text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/** Composant Badge avec variantes de statut */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
