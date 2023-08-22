import { IsDate } from 'class-validator';
import { JoinEntity } from './../entity/join.entity';
import { UserEntity } from 'src/entity/user.entity';
import { ChatEntity } from './../entity/chat.entity';
import { RoomEntity } from './../entity/room.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(JoinEntity)
    private readonly joinRepository: Repository<JoinEntity>,
  ) {}

  async joinUesr(user: UserEntity, roomId: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: { roomId: roomId },
      });
      if (!room) {
        throw new HttpException('존재하지 않는 채팅방입니다.', 400);
      }
      const userId = user.id;
      const exist = await this.joinRepository
        .createQueryBuilder()
        .where(`roomId = :roomId`, { roomId })
        .andWhere(`userId = :userId`, { userId })
        .andWhere(`joinRoom = 1`)
        .getRawOne();
      if (exist) {
        throw new HttpException('잘못된 요청입니다.', 400);
      }
      const join = this.joinRepository.create();
      join.roomId = roomId;
      join.userId = user.id;
      join.joinRoom = 1;
      return await this.joinRepository.save(join);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  async leaveUser(user: UserEntity, roomId: string) {
    try {
      const userId = user.id;
      const exist = await this.joinRepository.findOne({
        where: { roomId: roomId, userId: userId },
      });

      const result = await this.joinRepository.delete(exist);
      console.log(exist, '유저가 남아있나?');
      console.log(result, '유저가 남아있나? 삭제 말고 다르게 해야하나');
      return result;
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }

  async createChat(user: UserEntity, roomId: string, message: string) {
    try {
      const chat = this.chatRepository.create();
      chat.userId = user.id;
      chat.username = user.username;
      chat.roomId = roomId;
      chat.chat = message;
      await this.chatRepository.save(chat);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }

  async joinUserList(roomId: string) {
    try {
      const userList = this.chatRepository
        .createQueryBuilder('chat')
        .select(['ue.username'])
        .where({ roomId: roomId })
        .leftJoin(UserEntity, 'ue', 'chat.userId = ue.id');

      const data = await userList.getRawMany();
      const count = await userList.getCount();

      return { data, count };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }
}
