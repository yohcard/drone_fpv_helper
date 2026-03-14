import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { requestService } from "../services/RequestService"
import { AppDataSource } from "../config/database"
import { Expense } from "../entities/Expense"
import { WorkSession } from "../entities/WorkSession"
import { User } from "../entities/User"
import { MoreThan } from "typeorm"

export async function adminRoutes(server: FastifyInstance) {

  // Middleware Admin
  server.addHook("preHandler", async (request: any, reply) => {
    await server.authenticate(request, reply)
    if (request.user.role !== "ADMIN") {
      return reply.status(403).send({ error: "Accès réservé aux administrateurs" })
    }
  })

  // Statistiques du Dashboard
  server.get("/stats", async () => {
    // Revenu Total (Somme de toutes les dépenses facturées avec un montant)
    const expenseRepository = AppDataSource.getRepository(Expense)
    const { totalRevenue } = await expenseRepository
      .createQueryBuilder("expense")
      .select("SUM(expense.amount)", "totalRevenue")
      .getRawOne()

    // Heures de Vol (On utilise la somme des sessions de travail / 2 pour obtenir les heures)
    const sessionRepository = AppDataSource.getRepository(WorkSession)
    const { totalDurationHalfHours } = await sessionRepository
      .createQueryBuilder("session")
      .select("SUM(session.durationHalfHours)", "totalDurationHalfHours")
      .getRawOne()
    
    // Demandes Actives et Urgentes
    const requestRepository = AppDataSource.getRepository("RepairRequest") as any
    const activeRequests = await requestRepository.count({
      where: { status: "EN_REPARATION" } // Ou on peut compter tout sauf TERMINE
    })
    const diagnosticRequests = await requestRepository.count({
      where: { status: "DIAGNOSTIC" } 
    })
    const totalActive = activeRequests + diagnosticRequests + await requestRepository.count({ where: { status: "RECU" } })

    // Clients uniques
    const userRepository = AppDataSource.getRepository(User)
    const uniqueClients = await userRepository.count({
      where: { role: "CLIENT" }
    })

    // Nouveaux clients depuis hier
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const newClients = await userRepository.count({
      where: { 
        role: "CLIENT",
        createdAt: MoreThan(yesterday)
      }
    })

    // Demandes récentes
    const recentRequests = await requestRepository.find({
      relations: ["user", "expenses"],
      order: { createdAt: "DESC" },
      take: 5
    })

    // Map recent requests to expected frontend format
    const formattedRecentRequests = recentRequests.map((req: any) => ({
      id: req.id,
      ticket: req.ticketNumber,
      client: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Inconnu',
      device: req.deviceModel,
      status: req.status,
      price: req.expenses ? `${req.expenses.reduce((acc: number, exp: any) => Math.max(0, acc + Number(exp.amount || 0)), 0).toFixed(2)} CHF` : "0.00 CHF" // Note: we need to join expenses to get correct price, but for simplicity we can fetch expenses separately or join them. Let's do a join in the find query.
    }))

    return {
      kpis: {
        totalRevenue: Number(totalRevenue || 0),
        totalFlightHours: Number(totalDurationHalfHours || 0) / 2, // convert half-hours to hours
        activeRequests: totalActive,
        urgentRequests: diagnosticRequests, // using diagnostic as "urgent" indicator or 0
        uniqueClients,
        newClientsYesterday: newClients
      },
      recentRequests: formattedRecentRequests,
      alerts: [] // Keep empty for now, could be dynamic later
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
    const { description, amount, date } = request.body as any
    const admin = (request as any).user

    const expenseRepository = AppDataSource.getRepository(Expense)
    const expense = expenseRepository.create({
      requestId: id,
      description,
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
  
  // Détails d'un client
  server.get("/clients/:id" , async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    const userRepository = AppDataSource.getRepository(User)
    
    // On récupère le client avec ses demandes
    const client = await userRepository.findOne({
      where: { id },
      relations: ["requests"]
    })

    if (!client) return reply.status(404).send({ error: "Client non trouvé" })
    
    // On trie les demandes par date de création (DESC) manuellement si nécessaire
    // ou on laisse TypeORM le faire via relations
    
    return client
  })
}
