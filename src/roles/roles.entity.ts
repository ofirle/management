import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../permissions/permissions.entity';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permissions: Permission[];
  @OneToMany(() => User, (user) => user.role)
  user: User;
}
