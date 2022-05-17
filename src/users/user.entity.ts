import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Source } from '../sources/sources.entity';
import { Rule } from '../rules/rules.entity';
import { Category } from '../categories/categories.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  image: string;

  @OneToMany(() => Transaction, (transactions) => transactions.user, {
    eager: true,
  })
  transactions: Transaction[];

  @OneToMany(() => Source, (sources) => sources.user)
  sources: Source[];

  @OneToMany(() => Rule, (rules) => rules.user)
  rules: Rule[];

  @OneToMany(() => Category, (categories) => categories.user)
  categories: Category[];
}
