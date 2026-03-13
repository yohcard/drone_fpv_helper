import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm"
import { RepairRequest } from "./RepairRequest"
import { User } from "./User"

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  requestId!: string

  @ManyToOne(() => RepairRequest, (request) => request.messages)
  @JoinColumn({ name: "requestId" })
  request!: RepairRequest

  @Column()
  senderId!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "senderId" })
  sender!: User

  @Column({ type: "text" })
  content!: string

  @CreateDateColumn()
  sentAt!: Date

  @Column({ nullable: true })
  readAt?: Date
}
