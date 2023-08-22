import { AuthModule } from './../auth/auth.module';
import { JoinEntity } from './../entity/join.entity';
import { ChatEntity } from './../entity/chat.entity';
import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { ConcertEntity } from 'src/entity/concert.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RoomEntity } from 'src/entity/room.entity';
import { WsJwtGuard } from 'src/auth/jwt/jwt.wsguard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntity,
      UserEntity,
      RoomEntity,
      ChatEntity,
      JoinEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule,
    AuthModule,
  ],
  providers: [ChatsService, ChatsGateway, WsJwtGuard],
  exports: [ChatsGateway],
})
export class ChatsModule {}
