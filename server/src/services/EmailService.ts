import nodemailer from 'nodemailer'
import { User } from '../entities/User.js'
import { RepairRequest } from '../entities/RepairRequest.js'

/**
 * Service pour l'envoi d'emails transactionnels
 */
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Configuration du transporteur (Utilise Ethereal pour le dev si non configuré)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'placeholder@ethereal.email',
        pass: process.env.SMTP_PASS || 'placeholder_pass',
      },
    })
  }

  /**
   * Envoi d'un email de bienvenue
   */
  async sendWelcomeEmail(user: User) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #f97316;">Bienvenue chez drone-builder.ch !</h1>
        <p>Bonjour ${user.firstName},</p>
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant soumettre vos demandes de réparation ou de montage de drones FPV.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/login" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Se connecter</a>
        </div>
        <p>À bientôt,<br>L'équipe drone-builder.ch</p>
      </div>
    `

    await this.sendEmail(user.email, 'Bienvenue sur drone-builder.ch', html)
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
        <p>À bientôt,<br>L'équipe drone-builder.ch</p>
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
        <p>À bientôt,<br>L'équipe drone-builder.ch</p>
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
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte drone-builder.ch.</p>
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
      await this.transporter.sendMail({
        from: `"drone-builder.ch" <${process.env.SMTP_FROM || 'noreply@drone-builder.ch'}>`,
        to,
        subject,
        html,
      })
      console.log(`Email sent to ${to}: ${subject}`)
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error)
    }
  }
}
