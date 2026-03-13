import { AppDataSource } from "../config/database"
import { RepairRequest } from "../entities/RepairRequest"
import { StatusHistory } from "../entities/StatusHistory"
import { EmailService } from "./EmailService"
import { User } from "../entities/User"

export class RequestService {
  private requestRepository = AppDataSource.getRepository(RepairRequest)
  private historyRepository = AppDataSource.getRepository(StatusHistory)
  private userRepository = AppDataSource.getRepository(User)
  private emailService = new EmailService()

  /** Créer une nouvelle demande */
  async createRequest(data: Partial<RepairRequest>): Promise<RepairRequest> {
    const ticketNumber = await this.generateTicketNumber()
    const request = this.requestRepository.create({
      ...data,
      ticketNumber,
      status: "RECU"
    })
    
    const savedRequest = await this.requestRepository.save(request)

    // Initialiser l'historique
    await this.addStatusHistory(savedRequest.id, "INITIAL", "RECU", "Demande créée")

    // Envoyer l'email de confirmation
    if (savedRequest.userId) {
      const user = await this.userRepository.findOneBy({ id: savedRequest.userId })
      if (user) {
        this.emailService.sendRequestCreatedEmail(user, savedRequest).catch(e => console.error(e))
      }
    }

    return savedRequest
  }

  /** Générer un numéro de ticket (ex: DR-2024-001) */
  private async generateTicketNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await this.requestRepository.count()
    const sequence = (count + 1).toString().padStart(3, '0')
    return `DR-${year}-${sequence}`
  }

  /** Ajouter une entrée à l'historique de statut */
  async addStatusHistory(requestId: string, fromStatus: string, toStatus: string, note?: string) {
    const history = this.historyRepository.create({
      requestId,
      fromStatus,
      toStatus,
      note
    })
    return this.historyRepository.save(history)
  }

  /** Lister les demandes d'un client */
  async getClientRequests(userId: string) {
    return this.requestRepository.find({
      where: { userId },
      order: { createdAt: "DESC" }
    })
  }

  /** Récupérer le détail d'une demande */
  async getRequestById(id: string) {
    return this.requestRepository.findOne({
      where: { id },
      relations: ["statusHistory", "messages", "expenses", "workSessions", "user"]
    })
  }

  /** Mettre à jour le statut (Admin) */
  async updateStatus(id: string, newStatus: any, note?: string) {
    const request = await this.requestRepository.findOneBy({ id })
    if (!request) return null

    const oldStatus = request.status
    request.status = newStatus
    await this.requestRepository.save(request)

    await this.addStatusHistory(id, oldStatus, newStatus, note)

    // Notifier le changement par email
    const fullRequest = await this.getRequestById(id)
    if (fullRequest && fullRequest.user) {
      this.emailService.sendStatusUpdateEmail(fullRequest.user, fullRequest).catch(e => console.error(e))
    }

    return request
  }
}

export const requestService = new RequestService()
