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

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly usersService: UsersService,
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

  async getAllRoom(): Promise<RoomEntity[]> {
    return await this.roomRepository.createQueryBuilder('room').getMany();
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
}
