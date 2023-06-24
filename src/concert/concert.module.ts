import { UserEntity } from 'src/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from './../users/users.service';
import { ConcertEntity } from './../entity/concert.entity';
import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcertEntity, UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  providers: [ConcertService, UsersService],
  controllers: [ConcertController],
})
export class ConcertModule {}
