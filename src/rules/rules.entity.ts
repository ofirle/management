import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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
    nullable: true,
  })
  category: Category | number;

  @RelationId((rule: Rule) => rule.category) // you need to specify target relation
  categoryId: number;
  @ManyToMany(() => Source)
  @JoinTable()
  sources: Source[] | number[];
  @RelationId((rule: Rule) => rule.category) // you need to specify target relation
  sourcesIds: number[];
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.rules)
  user: User | number;
}
