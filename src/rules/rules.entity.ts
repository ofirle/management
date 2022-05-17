import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../categories/categories.entity';
import { Type } from '../transactions/dto/enums';
import { User } from '../users/user.entity';
import { Source } from '../sources/sources.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'json' })
  conditions;
  @Column({ default: false })
  isArchived: boolean;
  @Column({ nullable: true })
  setTitle: string;
  @Column({ nullable: true })
  transactionType: Type;
  @ManyToOne(() => Category, (category) => category.rules, {
    eager: true,
    nullable: true,
  })
  category: Category;
  @ManyToMany(() => Source)
  @JoinTable()
  sources: Source[];
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.rules)
  user: User;
}
