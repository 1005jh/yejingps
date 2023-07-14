import { AuthGuard } from './../auth/jwt/jwt.guard';
import { LoginDto } from './../common/dtos/user-login.dto';
import { UsersService } from './users.service';
import { SuccessInterceptor } from './../common/interceptor/interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignupUserDto } from 'src/common/dtos/user-signup.dto';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { useContainer } from 'class-validator';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: SignupUserDto): Promise<UserEntity> {
    return this.usersService.signup(dto);
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: LoginDto,
  ) {
    const token = await this.authService.login(dto);
    res.setHeader('Authorization', 'Bearer ' + token);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, //1d
    });
    console.log(req.headers);
    console.log(req.cookies);
    return res.send({ success: true });
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response): any {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    res.clearCookie('jwt');
    return res.send({
      success: true,
    });
  }

  @Get('token')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request, @Res() res: Response): any {
    const jwt = req.cookies['jwt'];
    return res.send({
      message: 'success',
      jwt,
    });
  }
  @Get('my_profile')
  @UseGuards(AuthGuard)
  isMyProfile(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.usersService.isMtProfile(user);
  }

  @Put('my_profile/nickname')
  @UseGuards(AuthGuard)
  updateUserNickname(
    @CurrentUser() user: UserEntity,
    @Body('nickname') nickname: string,
  ): Promise<UserEntity> {
    return this.usersService.updateUserNickname(user, nickname);
  }

  @Put('test_user')
  @UseGuards(AuthGuard)
  async admin(@CurrentUser() user: UserEntity) {
    return this.usersService.admin(user);
  }
}
