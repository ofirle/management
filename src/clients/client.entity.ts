import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  phone: string;
  @Column()
  @IsEmail()
  email: string;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
