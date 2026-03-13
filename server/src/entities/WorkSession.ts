import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm"
import { RepairRequest } from "./RepairRequest"

@Entity("work_sessions")
export class WorkSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  requestId!: string

  @ManyToOne(() => RepairRequest, (request) => request.workSessions)
  @JoinColumn({ name: "requestId" })
  request!: RepairRequest

  @Column({ type: "int" })
  durationHalfHours!: number // 1 = 0.5h = 25 CHF

  @Column({ nullable: true, type: "text" })
  note?: string

  @CreateDateColumn()
  loggedAt!: Date
}
