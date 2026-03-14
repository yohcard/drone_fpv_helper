import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import cookie from "@fastify/cookie"
import multipart from "@fastify/multipart"
import { AppDataSource } from "./config/database"
import dotenv from "dotenv"

// Import entities for explicit registration (cleaner for TypeORM)
import { User } from "./entities/User"
import { RepairRequest } from "./entities/RepairRequest"
import { StatusHistory } from "./entities/StatusHistory"
import { Message } from "./entities/Message"
import { Expense } from "./entities/Expense"
import { WorkSession } from "./entities/WorkSession"
import { ContactMessage } from "./entities/ContactMessage"
import { EmailService } from "./services/EmailService"

dotenv.config()

const server = Fastify({
  logger: true,
})

// Register plugins
server.register(cors, {
  origin: (origin, cb) => {
    const hostname = origin ? new URL(origin).hostname : ''
    const allowedOrigins = [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000",
      "https://www.dronefpvbuilder.shop",
      "https://dronefpvbuilder.shop"
    ].filter(Boolean) as string[]

    if (!origin || 
        allowedOrigins.includes(origin) || 
        hostname === 'localhost' || 
        hostname === '127.0.0.1' ||
        hostname.endsWith('.vercel.app')) {
      cb(null, true)
      return
    }
    cb(new Error("Not allowed by CORS"), false)
  },
  credentials: true,
})

server.register(jwt, {
  secret: process.env.JWT_SECRET || "super-secret-key",
  cookie: {
    cookieName: "accessToken",
    signed: false,
  },
})

server.register(cookie)

server.register(multipart, {
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 Mo
  },
})

// Decorate server with authenticate method
server.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

// Import and register routes
import { authRoutes } from "./routes/auth"
import { requestRoutes } from "./routes/requests"
import { messageRoutes } from "./routes/messages"
import { adminRoutes } from "./routes/admin"

server.register(authRoutes, { prefix: "/api/v1/auth" })
server.register(requestRoutes, { prefix: "/api/v1/requests" })
server.register(messageRoutes, { prefix: "/api/v1/messages" })
server.register(adminRoutes, { prefix: "/api/v1/admin" })

// Public contact route
server.post("/api/v1/contact", async (request, reply) => {
  const { name, email, message } = request.body as any
  const contactRepository = AppDataSource.getRepository(ContactMessage)
  const userRepository = AppDataSource.getRepository(User)
  const emailService = new EmailService()
  
  const newMessage = contactRepository.create({ name, email, message })
  await contactRepository.save(newMessage)

  // Notifier l'admin
  const admin = await userRepository.findOneBy({ role: 'ADMIN' })
  if (admin) {
    const html = `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</div>
    `
    // On peut réutiliser EmailService.sendEmail si on la rend publique ou ajouter une méthode dédiée
    // Pour aller vite on caste provisoirement
    await (emailService as any).sendEmail(admin.email, `Contact: ${name}`, html)
  }

  return { message: "Message envoyé avec succès" }
})

// Database initialization
const start = async () => {
  try {
    // Manually register entities to avoid glob issues
    AppDataSource.setOptions({
      entities: [User, RepairRequest, StatusHistory, Message, Expense, WorkSession, ContactMessage]
    });

    await AppDataSource.initialize()
    server.log.info("Database connection initialized")

    await server.listen({ 
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0" 
    })
    
    console.log(`Server listening at http://localhost:${process.env.PORT || 3000}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// Health check
server.get("/health", async () => {
  return { status: "ok", timestamp: new Date() }
})

start()
