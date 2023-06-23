import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'CONCERT' })
export class ConcertEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  title: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;
}
