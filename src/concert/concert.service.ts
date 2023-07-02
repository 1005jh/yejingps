import { ManageEnum } from './../common/enum/manage.enum';
import { UpdateConcertDto } from './../common/dtos/update-concert.dto';
import { UsersService } from './../users/users.service';
import { CreateConcertDto } from './../common/dtos/create-concert.dto';
import { ConcertEntity } from './../entity/concert.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getConnection } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    private readonly usersService: UsersService,
    private readonly connection: Connection,
  ) {}

  async createConcert(
    user: UserEntity,
    dto: CreateConcertDto,
  ): Promise<ConcertEntity> {
    try {
      const existUser = this.usersService.getUser(user.id);
      if (!existUser) {
        throw new HttpException('잘못된 요청', 400);
      }
      const concert = this.concertRepository.create();
      concert.title = dto.title;
      concert.location = dto.location;
      concert.content = dto.content;
      concert.gpsLat = dto.gpsLat;
      concert.gpsLng = dto.gpsLng;
      concert.startDate = dto.startDate;
      await this.concertRepository.save(concert);
      return await this.getConcert(concert.id);
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  async getConcert(concertId): Promise<ConcertEntity> {
    return await this.concertRepository
      .createQueryBuilder('concert')
      .where({ id: concertId })
      .getOne();
  }

  async getAllConcert(): Promise<ConcertEntity[]> {
    return await this.concertRepository.createQueryBuilder('concert').getMany();
  }

  async updateConcert(
    user: UserEntity,
    dto: UpdateConcertDto,
    id: number,
  ): Promise<ConcertEntity> {
    const admin = await this.usersService.getUser(user.id);
    if (admin.manage !== ManageEnum.ADMIN) {
      throw new HttpException('권한 없음', 400);
    }
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const concert = await this.getConcert(id);
      concert.title = dto.title;
      concert.location = dto.location;
      concert.content = dto.content;
      concert.gpsLat = dto.gpsLat;
      concert.gpsLng = dto.gpsLng;
      concert.startDate = dto.startDate;
      await queryRunner.manager.save(ConcertEntity, concert);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return this.getConcert(id);
  }
}
