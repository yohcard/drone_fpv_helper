import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm"
import { RepairRequest } from "./RepairRequest"

@Entity("status_history")
export class StatusHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  requestId!: string

  @ManyToOne(() => RepairRequest, (request) => request.statusHistory)
  @JoinColumn({ name: "requestId" })
  request!: RepairRequest

  @Column()
  fromStatus!: string

  @Column()
  toStatus!: string

  @Column({ nullable: true, type: "text" })
  note?: string

  @CreateDateColumn()
  changedAt!: Date
}
