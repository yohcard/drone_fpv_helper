import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from "typeorm"
import { RepairRequest } from "./RepairRequest"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ unique: true })
  email!: string

  @Column({ select: false })
  passwordHash!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  address?: string

  @Column({
    type: "varchar",
    default: "CLIENT"
  })
  role!: "CLIENT" | "ADMIN"

  @Column({ nullable: true })
  resetPasswordToken?: string

  @Column({ type: "datetime", nullable: true })
  resetPasswordExpires?: Date

  @Column({ nullable: true })
  googleId?: string

  @OneToMany(() => RepairRequest, (request) => request.user)
  requests!: RepairRequest[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
