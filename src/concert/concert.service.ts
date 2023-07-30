import { RoomEntity } from './../entity/room.entity';
import { ManageEnum } from './../common/enum/manage.enum';
import { UpdateConcertDto } from './../common/dtos/update-concert.dto';
import { UsersService } from './../users/users.service';
import { CreateConcertDto } from './../common/dtos/create-concert.dto';
import { ConcertEntity } from './../entity/concert.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getConnection } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { customAlphabet } from 'nanoid';
import { ConfigService } from '@nestjs/config';
// import * as AWS from 'aws-sdk';

@Injectable()
export class ConcertService {
  private readonly s3;
  public readonly S3_BUCKET_NAME: string;
  public readonly S3_REGION: string;
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    private readonly usersService: UsersService,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {
    // AWS.config.update({
    //   region: this.configService.get('S3_REGION'),
    //   credentials: {
    //     accessKeyId: this.configService.get('S3_ACCESS_KEY'),
    //     secretAccessKey: this.configService.get('S3_SECRET_KEY'),
    //   },
    // });
    // this.s3 = new AWS.S3();
    // this.S3_BUCKET_NAME = this.configService.get('S3_BUCKET_NAME');
    // this.S3_REGION = this.configService.get('S3_REGION');
  }

  async createConcert(
    user: UserEntity,
    dto: CreateConcertDto,
    // file: Express.Multer.File,
  ) {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789', 12);
    const roomId = nanoid();
    try {
      // const ext = file.originalname.split('.').pop();
      // const key = `original/${
      //   Math.floor(Math.random() * 10000).toString() + Date.now()
      // }.${ext}`;
      // const params = {
      //   Bucket: process.env.S3_BUCKET_NAME,
      //   ACL: 'public-read',
      //   Key: key,
      //   Body: file.buffer,
      // };
      // const concertImg = `https://${this.S3_BUCKET_NAME}.s3.${this.S3_REGION}.amazonaws.com/${key}`;
      // new Promise((resolve, reject) => {
      //   this.s3.putObject(params, (err, data) => {
      //     if (err) reject(err);
      //     resolve(concertImg);
      //   });
      // });
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
      // concert.concertImg = concertImg;
      await this.concertRepository.save(concert);
      const room = this.roomRepository.create();
      room.name = dto.title;
      room.roomId = roomId;
      room.concertId = concert.id;
      await this.roomRepository.save(room);
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

  async getAllConcert() {
    const a = await this.concertRepository
      .createQueryBuilder('ce')
      .select([
        'ce.id AS id',
        'ce.title AS title',
        'ce.startDate AS startDate',
        'ce.content AS content',
        'ce.location AS location',
        'ce.gpsLat AS gpsLat',
        'ce.gpsLng AS gpsLng',
        'ce.concertImg AS concertImg',
        're.roomId AS roomId',
        're.name AS roomName',
      ])
      .leftJoin(RoomEntity, 're', 'ce.id = re.concertId')
      .orderBy('ce.startDate', 'DESC')
      .getRawMany();
    console.log(a);
    return a;
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

  async remove(id: number) {
    return await this.concertRepository
      .createQueryBuilder('concert')
      .delete()
      .where(`id =:id`, { id: id })
      .execute();
  }
}
