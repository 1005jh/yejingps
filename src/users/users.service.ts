import { SignupUserDto } from './../common/dtos/user-signup.dto';
import { UserEntity } from './../entity/user.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ManageEnum } from 'src/common/enum/manage.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signup(dto: SignupUserDto): Promise<UserEntity> {
    const existUser = await this.findUser(dto.username);
    if (existUser) {
      throw new HttpException('존재하는 ID', 400);
    }
    const saltOrRounds = 10;
    const password = dto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    try {
      const newUser = this.userRepository.create();
      newUser.username = dto.username;
      newUser.password = hash;
      newUser.manage = ManageEnum.MEMBER;
      await this.userRepository.save(newUser);
      return this.getUser(newUser.id);
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  //* role 추가되면 추가해줘야함.
  async findUser(username: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ username: username })
      .select()
      .getOne();
  }
  async getUser(userId: number): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ id: userId })
      .select(['user.username', 'user.id', 'user.manage'])
      .getOne();
  }

  async isMtProfile(user: UserEntity): Promise<UserEntity> {
    try {
      const existUser = await this.getUser(user.id);
      if (!existUser) {
        throw new HttpException('잘못된 요청', 400);
      }
      return existUser;
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  async admin(user: UserEntity) {
    try {
      const existUser = await this.getUser(user.id);
      existUser.manage = ManageEnum.ADMIN;
      await this.userRepository.save(existUser);

      return existUser;
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }
}
