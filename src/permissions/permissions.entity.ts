import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ActionsEnum } from '../shared/enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  action: ActionsEnum;
}
