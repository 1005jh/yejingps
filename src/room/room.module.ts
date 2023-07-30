import { ChatEntity } from './../entity/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { RoomEntity } from './../entity/room.entity';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from 'src/entity/concert.entity';
import { UserEntity } from 'src/entity/user.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntity,
      UserEntity,
      RoomEntity,
      ChatEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
