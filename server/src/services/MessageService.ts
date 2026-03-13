import { AppDataSource } from "../config/database"
import { Message } from "../entities/Message"
import { EmailService } from "./EmailService"
import { RepairRequest } from "../entities/RepairRequest"
import { User } from "../entities/User"

export class MessageService {
  private messageRepository = AppDataSource.getRepository(Message)
  private requestRepository = AppDataSource.getRepository(RepairRequest)
  private userRepository = AppDataSource.getRepository(User)
  private emailService = new EmailService()

  /** Envoyer un message */
  async sendMessage(requestId: string, senderId: string, content: string) {
    const message = this.messageRepository.create({
      requestId,
      senderId,
      content
    })
    const savedMessage = await this.messageRepository.save(message)

    // Notifier le destinataire par email
    this.notifyRecipient(requestId, senderId, content).catch(e => console.error(e))

    return savedMessage
  }

  /** Identifier et notifier le destinataire */
  private async notifyRecipient(requestId: string, senderId: string, content: string) {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: ["user"]
    })

    if (!request) return

    const sender = await this.userRepository.findOneBy({ id: senderId })
    if (!sender) return

    // Si l'envoyeur est le client, on notifie l'admin (technicien)
    // Si l'envoyeur est l'admin, on notifie le client
    let recipient: User | null = null
    
    if (sender.role === 'ADMIN') {
      recipient = request.user
    } else {
      // Trouver l'admin (pour simplifier, on prend le premier admin trouvé ou on définit un email admin fixe)
      recipient = await this.userRepository.findOneBy({ role: 'ADMIN' })
    }

    if (recipient) {
      await this.emailService.sendNewMessageEmail(recipient, `${sender.firstName} ${sender.lastName}`, request, content)
    }
  }

  /** Lister les messages d'une demande */
  async getRequestMessages(requestId: string) {
    return this.messageRepository.find({
      where: { requestId },
      relations: ["sender"],
      order: { sentAt: "ASC" }
    })
  }

  /** Marquer comme lu */
  async markAsRead(id: string) {
    await this.messageRepository.update(id, { readAt: new Date() })
  }
}

export const messageService = new MessageService()
