import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { messageService } from "../services/MessageService"
import { requestService } from "../services/RequestService"

export async function messageRoutes(server: FastifyInstance) {
  
  // Lister les messages d'une demande
  server.get("/:requestId", {
    preHandler: [server.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { requestId } = request.params as any
    const user = (request as any).user

    const repairRequest = await requestService.getRequestById(requestId)
    if (!repairRequest) {
      return reply.status(404).send({ error: "Demande non trouvée" })
    }

    if (user.role !== "ADMIN" && repairRequest.userId !== user.id) {
      return reply.status(403).send({ error: "Accès refusé" })
    }

    return messageService.getRequestMessages(requestId)
  })

  // Envoyer un message
  server.post("/:requestId", {
    preHandler: [server.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { requestId } = request.params as any
    const { content } = request.body as any
    const user = (request as any).user

    const repairRequest = await requestService.getRequestById(requestId)
    if (!repairRequest) {
      return reply.status(404).send({ error: "Demande non trouvée" })
    }

    // Le chat n'est possible qu'en étant admin ou le proprio, et si le ticket n'est pas annulé/livré (simplification)
    if (user.role !== "ADMIN" && repairRequest.userId !== user.id) {
      return reply.status(403).send({ error: "Accès refusé" })
    }

    return messageService.sendMessage(requestId, user.id, content)
  })
}
