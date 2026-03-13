import bcrypt from "bcrypt"
import { AppDataSource } from "../config/database"
import { User } from "../entities/User"
import { EmailService } from "./EmailService"

export class AuthService {
  private userRepository = AppDataSource.getRepository(User)
  private emailService = new EmailService()

  /** Hasher un mot de passe */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  /** Vérifier un mot de passe */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /** Trouver un utilisateur par email */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ["id", "email", "passwordHash", "firstName", "lastName", "role"]
    })
  }

  /** Créer un nouvel utilisateur */
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData)
    const savedUser = await this.userRepository.save(user)
    
    // Notification de bienvenue
    this.emailService.sendWelcomeEmail(savedUser).catch(err => console.error('Email error:', err))
    
    return savedUser
  }

  /** Trouver un utilisateur par ID */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  /** Demander la réinitialisation du mot de passe */
  async requestPasswordReset(email: string): Promise<string | null> {
    const user = await this.findByEmail(email)
    if (!user) return null

    const token = require('crypto').randomBytes(20).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 heure

    user.resetPasswordToken = token
    user.resetPasswordExpires = expires
    await this.userRepository.save(user)

    // Envoyer l'email
    this.emailService.sendPasswordResetEmail(user, token).catch(err => console.error('Email error:', err))

    return token
  }

  /** Réinitialiser le mot de passe avec un token */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { 
        resetPasswordToken: token
      },
      select: ["id", "email", "passwordHash", "resetPasswordToken", "resetPasswordExpires"]
    })

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return false
    }

    user.passwordHash = await this.hashPassword(newPassword)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await this.userRepository.save(user)

    return true
  }
}

export const authService = new AuthService()
