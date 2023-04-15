import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { Exclude, Expose } from "class-transformer"
import Address from "./address.entity"
import Post from "../post/post.entity"

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number

  @Column({ unique: true })
  public email: string

  @Column()
  @Expose()
  public name: string

  @Column()
  @Exclude()
  public password: string

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[]
}

export default User
