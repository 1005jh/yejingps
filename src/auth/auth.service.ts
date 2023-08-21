import { UsersService } from './../users/users.service';
import { LoginDto } from './../common/dtos/user-login.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

interface Payload {
  username?: string;
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    try {
      const existUser = await this.usersService.findUser(dto.username);
      if (!existUser) {
        throw new HttpException('아이디 비번 확인', 400);
      }
      const isValidatePassword: boolean = await bcrypt.compare(
        dto.password,
        existUser.password,
      );
      if (!isValidatePassword) {
        throw new HttpException('아이디 비밀번호 확인', 400);
      }

      const payload: Payload = {
        username: existUser.username,
        id: existUser.id,
      };
      const token = this.jwtService.sign(payload);
      return token;
    } catch (e) {
      console.log(e);
      throw new HttpException(e, 400);
    }
  }

  async validateUser(payload: Payload) {
    console.log('여기');
    const result = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: payload.id })
      .select(['user.username', 'user.id', 'user.manage'])
      .getMany();
    console.log('123123', result);
    return result;
  }
}
