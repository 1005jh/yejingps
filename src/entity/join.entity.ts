import { UserEntity } from './user.entity';
import { RoomEntity } from './room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'JOIN' })
export class JoinEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint', nullable: false })
  joinRoom: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.joins)
  user: UserEntity;

  @Column({ type: 'varchar', length: 16, nullable: false })
  roomId: string;
}
