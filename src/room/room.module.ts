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
    TypeOrmModule.forFeature([ConcertEntity, UserEntity, RoomEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
