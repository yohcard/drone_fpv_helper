import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm"
import { User } from "./User"
import { StatusHistory } from "./StatusHistory"
import { Message } from "./Message"
import { Expense } from "./Expense"
import { WorkSession } from "./WorkSession"

@Entity("repair_requests")
export class RepairRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ unique: true })
  ticketNumber!: string // ex: DR-2024-001

  @Column()
  userId!: string

  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: "userId" })
  user!: User

  @Column({
    type: "varchar"
  })
  serviceType!: "REPAIR" | "BUILD"

  @Column()
  issueType!: string

  @Column({ nullable: true, type: "text" })
  issueDescription?: string

  @Column({ nullable: true, type: "text" })
  additionalDescription?: string

  @Column({
    type: "varchar",
    default: "RECU"
  })
  status!: 'RECU' | 'DIAGNOSTIC' | 'EN_ATTENTE_PIECES' | 'EN_REPARATION' | 'TERMINE' | 'LIVRE' | 'ANNULE'

  @Column("simple-array", { nullable: true })
  attachments!: string[]

  @OneToMany(() => StatusHistory, (history) => history.request)
  statusHistory!: StatusHistory[]

  @OneToMany(() => Message, (message) => message.request)
  messages!: Message[]

  @OneToMany(() => Expense, (expense) => expense.request)
  expenses!: Expense[]

  @OneToMany(() => WorkSession, (session) => session.request)
  workSessions!: WorkSession[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
