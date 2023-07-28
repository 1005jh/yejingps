import { ChatEntity } from './chat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';
import { ManageEnum } from 'src/common/enum/manage.enum';
import { JoinEntity } from './join.entity';

@Entity({ name: 'USER' })
export class UserEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', default: ManageEnum.MEMBER })
  manage: ManageEnum;
  //* user gps 추가 필요

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chats: Promise<ChatEntity[]>;

  @OneToMany(() => JoinEntity, (join) => join.user)
  joins: Promise<JoinEntity[]>;
}
