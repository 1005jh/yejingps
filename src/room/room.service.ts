import { ChatEntity } from './../entity/chat.entity';
import { UpdateRoomDto } from './../common/dtos/update-room.dto';
import { UsersService } from './../users/users.service';
import { CreateRoomDto } from './../common/dtos/create-room.dto';
import { UserEntity } from 'src/entity/user.entity';
import { RoomEntity } from './../entity/room.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManageEnum } from 'src/common/enum/manage.enum';
import { customAlphabet } from 'nanoid';
import { ConcertEntity } from 'src/entity/concert.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly usersService: UsersService,
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async createRoom(user: UserEntity, dto: CreateRoomDto): Promise<RoomEntity> {
    const admin = await this.usersService.getUser(user.id);
    if (admin.manage !== ManageEnum.ADMIN) {
      throw new HttpException('권한 없음', 400);
    }
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789', 12);
    const roomId = nanoid();
    try {
      const room = this.roomRepository.create();
      room.name = dto.name;
      room.roomId = roomId;
      await this.roomRepository.save(room);
      return this.getRoom(room.id);
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  async getRoom(roomId: number): Promise<RoomEntity> {
    return await this.roomRepository
      .createQueryBuilder('room')
      .where({ id: roomId })
      .getOne();
  }

  async getAllRoom() {
    return await this.roomRepository
      .createQueryBuilder('re')
      .select(['re', 'ce'])
      .leftJoin('re.concert', 'ce', 'ce.id = re.concertId')
      .orderBy('ce.startDate', 'DESC')
      .getMany();
  }

  async updateRoomData(
    user: UserEntity,
    dto: UpdateRoomDto,
    id: number,
  ): Promise<RoomEntity> {
    const admin = await this.usersService.getUser(user.id);
    if (admin.manage !== ManageEnum.ADMIN) {
      throw new HttpException('권한 없음', 400);
    }
    try {
      const room = await this.getRoom(id);
      room.name = dto.name;
      await this.roomRepository.save(room);
      return room;
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  async deletRoom(user: UserEntity, id: number) {
    const admin = await this.usersService.getUser(user.id);
    if (admin.manage !== ManageEnum.ADMIN) {
      throw new HttpException('권한 없음', 400);
    }
    try {
      return await this.roomRepository
        .createQueryBuilder('room')
        .delete()
        .where({ id: id })
        .execute();
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  async getChatList(roomId: string, id: number) {
    const take = 20; // 한 번에 가져올 채팅의 개수

    try {
      const query = this.chatRepository.createQueryBuilder();

      // "where" 조건 추가
      query.where('roomId = :roomId', { roomId });
      console.log(id);
      // 시간에 따른 추가 조건
      const target = Object.values(id);
      const targetId = Number(target[0]);
      console.log(target);
      if (targetId) {
        query.andWhere('id < :targetId', { targetId });
      }

      // 정렬과 페이징
      query.orderBy('createdAt', 'DESC').take(take);

      const chatList = await query.getMany();
      console.log(chatList);
      return chatList;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }
}
