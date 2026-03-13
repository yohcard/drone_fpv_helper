import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { User } from '../entities/User.js'
import { RepairRequest } from '../entities/RepairRequest.js'

/**
 * Service pour l'envoi d'emails transactionnels
 */
export class EmailService {
  private transporter?: nodemailer.Transporter
  private resend?: Resend

  constructor() {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY)
      console.log('EmailService configured to use Resend API')
      return
    }

    console.log('EmailService configured to use SMTP/Ethereal fallback')
    const config: any = {
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      config.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    } else if (process.env.NODE_ENV === 'development') {
      // En dev, si pas d'auth, on utilise le transport JSON pour éviter les erreurs SMTP
      this.transporter = nodemailer.createTransport({ jsonTransport: true })
      return
    }

    this.transporter = nodemailer.createTransport(config)
  }

  /**
   * Envoi d'un email de bienvenue
   */
  async sendWelcomeEmail(user: User) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #f97316;">Bienvenue chez dronefpvbuilder.shop !</h1>
        <p>Bonjour ${user.firstName},</p>
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant soumettre vos demandes de réparation ou de montage de drones FPV.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/login" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Se connecter</a>
        </div>
        <p>À bientôt,<br>L'équipe dronefpvbuilder</p>
      </div>
    `

    await this.sendEmail(user.email, 'Bienvenue sur dronefpvbuilder.shop', html)
  }

  /**
   * Confirmation de nouvelle demande
   */
  async sendRequestCreatedEmail(user: User, request: RepairRequest) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #f97316;">Demande reçue : ${request.ticketNumber}</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Nous avons bien reçu votre demande pour : <strong>${request.issueType}</strong>.</p>
        <p>Un technicien va l'analyser prochainement pour établir un premier diagnostic.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
          <p style="margin: 0;"><strong>Statut actuel :</strong> ${request.status}</p>
        </div>
        <p>Vous pouvez suivre l'avancement en temps réel sur votre tableau de bord.</p>
        <p>À bientôt,<br>L'équipe dronefpvbuilder</p>
      </div>
    `

    await this.sendEmail(user.email, `Confirmation de votre demande ${request.ticketNumber}`, html)
  }

  /**
   * Notification de changement de statut
   */
  async sendStatusUpdateEmail(user: User, request: RepairRequest) {
    const statusLabels: Record<string, string> = {
      'RECU': 'Reçu',
      'DIAGNOSTIC': 'En cours de diagnostic',
      'EN_REPARATION': 'En cours de réparation',
      'TERMINE': 'Prêt / Terminé'
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #f97316;">Mise à jour de votre demande</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Le statut de votre demande <strong>${request.ticketNumber}</strong> a changé.</p>
        <div style="background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 25px 0;">
          <span style="font-size: 12px; font-weight: bold; text-transform: uppercase; opacity: 0.8;">Nouveau statut</span><br>
          <span style="font-size: 24px; font-weight: bold;">${statusLabels[request.status] || request.status}</span>
        </div>
        <p>Connectez-vous pour voir les détails ou échanger avec le technicien.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard/requests/${request.id}" style="border: 2px solid #f97316; color: #f97316; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Voir ma demande</a>
        </div>
        <p>À bientôt,<br>L'équipe dronefpvbuilder</p>
      </div>
    `

    await this.sendEmail(user.email, `Mise à jour : ${request.ticketNumber} - ${statusLabels[request.status]}`, html)
  }

  /**
   * Notification de nouveau message
   */
  async sendNewMessageEmail(recipient: User, senderName: string, request: RepairRequest, messageContent: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #f97316;">Nouveau message</h2>
        <p>Bonjour ${recipient.firstName},</p>
        <p>Vous avez reçu un nouveau message de <strong>${senderName}</strong> concernant la demande ${request.ticketNumber} :</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; font-style: italic; margin: 20px 0; color: #555;">
          "${messageContent}"
        </div>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard/requests/${request.id}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Répondre</a>
        </div>
      </div>
    `

    await this.sendEmail(recipient.email, `Nouveau message - ${request.ticketNumber}`, html)
  }

  /**
   * Notification de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(user: User, token: string) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #f97316;">Réinitialisation de votre mot de passe</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte dronefpvbuilder.shop.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable pendant 1 heure.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
        </div>
        <p style="font-size: 12px; color: #666;">Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 11px; color: #999;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>${resetUrl}</p>
      </div>
    `

    await this.sendEmail(user.email, 'Réinitialisation de votre mot de passe', html)
  }

  /**
   * Méthode générique d'envoi
   */
  public async sendEmail(to: string, subject: string, html: string) {
    try {
      const fromEmail = process.env.SMTP_FROM || 'noreply@dronefpvbuilder.shop'

      // Utilisation de l'API Resend (Priorité 1)
      if (this.resend) {
        const { data, error } = await this.resend.emails.send({
          from: `"dronefpvbuilder" <${fromEmail}>`,
          to: [to],
          subject,
          html,
        })

        if (error) {
          console.error(`Resend failed to send email to ${to}:`, error)
        } else {
          console.log(`Email sent via Resend to ${to}: ${subject} (ID: ${data?.id})`)
        }
        return
      }

      // Fallback SMTP / Ethereal dev mode
      if (this.transporter) {
        const info = await this.transporter.sendMail({
          from: `"dronefpvbuilder" <${fromEmail}>`,
          to,
          subject,
          html,
        })
        
        console.log(`Email sent via SMTP to ${to}: ${subject}`)
        
        // Si on utilise Ethereal ou le transport JSON, on affiche les détails
        if (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('ethereal')) {
          console.log('--- Email Detail (Dev Mode) ---')
          if (info.message) {
            // Log JSON content or extract URL
            const messageObj = JSON.parse(info.message)
            console.log(`To: ${messageObj.to}`)
            console.log(`Subject: ${messageObj.subject}`)
            // Extraire l'URL de réinitialisation du HTML pour la rendre facile à cliquer
            const urlMatch = messageObj.html.match(/href="([^"]+)"/)
            if (urlMatch) {
              console.log(`---> ACTION URL: ${urlMatch[1]}`)
            }
          }
          const previewUrl = nodemailer.getTestMessageUrl(info)
          if (previewUrl) {
            console.log('Preview URL: %s', previewUrl)
          }
          console.log('--------------------------------')
        }
      }
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
    }
  }
}
