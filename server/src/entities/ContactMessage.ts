import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn
} from "typeorm"

@Entity("contact_messages")
export class ContactMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  name!: string

  @Column()
  email!: string

  @Column({ type: "text" })
  message!: string

  @Column({ default: false })
  read!: boolean

  @CreateDateColumn()
  receivedAt!: Date
}
