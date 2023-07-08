import { ConcertEntity } from 'src/entity/concert.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'ROOM' })
export class RoomEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 12, nullable: false })
  roomId: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  concertId: number;

  @ManyToOne(() => ConcertEntity, (concert) => concert.rooms)
  concert: ConcertEntity;
}
