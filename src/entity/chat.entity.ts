import { UserEntity } from './user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'CHAT' })
export class ChatEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: Boolean })
  isAtLocation: boolean;

  @Column({ type: 'varchar', length: 12, nullable: false })
  roomId: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  user: UserEntity;
}
