import { ChatEntity } from './chat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'USER' })
export class UserEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  password: string;

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chats: Promise<ChatEntity[]>;
}
