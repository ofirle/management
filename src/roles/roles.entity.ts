import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../permissions/permissions.entity';
import { User } from '../auth/auth.entity';
import { Admins } from './enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  key: Admins;
  @Column()
  title: string;
  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permissions: Permission[];
  @OneToMany(() => User, (user) => user.role)
  user: User;
}
