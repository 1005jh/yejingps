import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'ROOM' })
export class RoomEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 12, nullable: false })
  roomId: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  name: string;
}
