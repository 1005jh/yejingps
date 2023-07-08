import { UserEntity } from './user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'CHAT' })
export class ChatEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text', nullable: false })
  chat: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.chats)
  user: UserEntity;
}