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
}

export const authService = new AuthService()
