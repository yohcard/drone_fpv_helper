import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { authService } from "../services/AuthService"

export async function authRoutes(server: FastifyInstance) {
  
  // Inscription
  server.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, firstName, lastName } = request.body as any

    if (!email || !password || !firstName || !lastName) {
      return reply.status(400).send({ error: "Tous les champs sont obligatoires" })
    }

    const existingUser = await authService.findByEmail(email)
    if (existingUser) {
      return reply.status(409).send({ error: "Cet email est déjà utilisé" })
    }

    const passwordHash = await authService.hashPassword(password)
    const user = await authService.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      role: "CLIENT"
    })

    const token = await reply.jwtSign({ id: user.id, role: user.role })
    
    reply.setCookie("accessToken", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return { 
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  })

  // Connexion
  server.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as any

    const user = await authService.findByEmail(email)
    if (!user) {
      return reply.status(401).send({ error: "Identifiants invalides" })
    }

    const isValid = await authService.comparePassword(password, user.passwordHash)
    if (!isValid) {
      return reply.status(401).send({ error: "Identifiants invalides" })
    }

    const token = await reply.jwtSign({ id: user.id, role: user.role })

    reply.setCookie("accessToken", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  })

  // Déconnexion
  server.post("/logout", async (request, reply) => {
    reply.clearCookie("accessToken")
    return { message: "Déconnexion réussie" }
  })

  // Me (current user)
  server.get("/me", {
    preHandler: [server.authenticate]
  }, async (request) => {
    return { user: (request as any).user }
  })
}
