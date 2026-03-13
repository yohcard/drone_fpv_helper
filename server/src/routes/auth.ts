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
    const decodedUser = (request as any).user
    const user = await authService.findByEmail(decodedUser.email || "") // Or findById if available
    
    // Fallback to ID if email not in token (let's check findById)
    const fullUser = await authService.findById(decodedUser.id)

    if (!fullUser) {
      throw new Error("Utilisateur non trouvé")
    }

    return { 
      user: {
        id: fullUser.id,
        email: fullUser.email,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        role: fullUser.role
      }
    }
  })

  // Mot de passe oublié (demande)
  server.post("/forgot-password", async (request, reply) => {
    const { email } = request.body as any
    if (!email) {
      return reply.status(400).send({ error: "L'email est requis" })
    }

    await authService.requestPasswordReset(email)
    
    // Pour des raisons de sécurité, on renvoie un message de succès même si l'email n'existe pas
    return { message: "Si un compte est associé à cet email, un lien de réinitialisation a été envoyé." }
  })

  // Réinitialisation du mot de passe (action)
  server.post("/reset-password", async (request, reply) => {
    const { token, password } = request.body as any
    if (!token || !password) {
      return reply.status(400).send({ error: "Token et mot de passe requis" })
    }

    const success = await authService.resetPassword(token, password)
    if (!success) {
      return reply.status(400).send({ error: "Le lien de réinitialisation est invalide ou a expiré" })
    }

    return { message: "Votre mot de passe a été réinitialisé avec succès" }
  })
}
