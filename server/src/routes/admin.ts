import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { requestService } from "../services/RequestService"
import { AppDataSource } from "../config/database"
import { Expense } from "../entities/Expense"
import { WorkSession } from "../entities/WorkSession"
import { User } from "../entities/User"

export async function adminRoutes(server: FastifyInstance) {

  // Middleware Admin
  server.addHook("preHandler", async (request: any, reply) => {
    await server.authenticate(request, reply)
    if (request.user.role !== "ADMIN") {
      return reply.status(403).send({ error: "Accès réservé aux administrateurs" })
    }
  })

  // Toutes les demandes
  server.get("/requests", async () => {
    const requestRepository = AppDataSource.getRepository("RepairRequest") as any
    return requestRepository.find({
      relations: ["user"],
      order: { createdAt: "DESC" }
    })
  })
  
  // Détail d'une demande
  server.get("/requests/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    const repairRequest = await requestService.getRequestById(id)
    if (!repairRequest) return reply.status(404).send({ error: "Demande non trouvée" })
    return repairRequest
  })

  // Changer le statut
  server.patch("/requests/:id/status", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    const { status, note } = request.body as any
    
    const updated = await requestService.updateStatus(id, status, note)
    if (!updated) return reply.status(404).send({ error: "Demande non trouvée" })
    
    return updated
  })

  // Ajouter une dépense
  server.post("/requests/:id/expenses", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    const { title, amount, date } = request.body as any
    const admin = (request as any).user

    const expenseRepository = AppDataSource.getRepository(Expense)
    const expense = expenseRepository.create({
      requestId: id,
      description: title, // Le frontend envoie 'title'
      amount,
      date: date ? new Date(date) : new Date(),
      addedByAdminId: admin.id
    })

    return expenseRepository.save(expense)
  })

  // Ajouter du temps
  server.post("/requests/:id/sessions", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    const { durationHalfHours, note } = request.body as any

    const sessionRepository = AppDataSource.getRepository(WorkSession)
    const session = sessionRepository.create({
      requestId: id,
      durationHalfHours,
      note
    })

    return sessionRepository.save(session)
  })

  // Liste des clients
  server.get("/clients", async () => {
    const userRepository = AppDataSource.getRepository(User)
    return userRepository.find({
      where: { role: "CLIENT" }
    })
  })
}
