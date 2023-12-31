import { JoinEntity } from './entity/join.entity';
import { ChatEntity } from './entity/chat.entity';
import { RoomEntity } from './entity/room.entity';
import { ConcertEntity } from './entity/concert.entity';
import { UserEntity } from './entity/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConcertModule } from './concert/concert.module';
import { RoomModule } from './room/room.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      timezone: 'local',
      database: process.env.DB_DATABASE,
      entities: [UserEntity, ConcertEntity, RoomEntity, ChatEntity, JoinEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ConcertEntity,
      RoomEntity,
      ChatEntity,
      JoinEntity,
    ]),
    UsersModule,
    AuthModule,
    ConcertModule,
    RoomModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
