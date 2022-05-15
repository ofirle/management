import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../categories/categories.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'json' })
  conditions;
  @ManyToOne(() => Category, (category) => category.rules, { eager: true })
  category: Category;
  @CreateDateColumn()
  createdAt: Date;
}
