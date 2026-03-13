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

@Entity("expenses")
export class Expense {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  requestId!: string

  @ManyToOne(() => RepairRequest, (request) => request.expenses)
  @JoinColumn({ name: "requestId" })
  request!: RepairRequest

  @Column()
  description!: string

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number

  @Column()
  date!: Date

  @Column()
  addedByAdminId!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "addedByAdminId" })
  addedBy!: User

  @CreateDateColumn()
  createdAt!: Date
}
