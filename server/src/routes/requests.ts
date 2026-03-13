import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { requestService } from "../services/RequestService"

export async function requestRoutes(server: FastifyInstance) {
  
  // Créer une nouvelle demande
  server.post("/", {
    preHandler: [(server as any).authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { serviceType, issueType, issueDescription, additionalDescription } = request.body as any
    const user = (request as any).user

    const newRequest = await requestService.createRequest({
      userId: user.id,
      serviceType,
      issueType,
      issueDescription,
      additionalDescription
    })

    return newRequest
  })

  // Lister ses propres demandes (Client)
  server.get("/my", {
    preHandler: [(server as any).authenticate]
  }, async (request: FastifyRequest) => {
    const user = (request as any).user
    return requestService.getClientRequests(user.id)
  })

  // Détail d'une demande
  server.get("/:id", {
    preHandler: [(server as any).authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any
    const user = (request as any).user

    const repairRequest = await requestService.getRequestById(id)
    if (!repairRequest) {
      return reply.status(404).send({ error: "Demande non trouvée" })
    }

    // Vérifier les droits (soit admin, soit le client propriétaire)
    if (user.role !== "ADMIN" && repairRequest.userId !== user.id) {
      return reply.status(403).send({ error: "Accès refusé" })
    }

    return repairRequest
  })
}
