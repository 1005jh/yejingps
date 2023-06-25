import { UserEntity } from 'src/entity/user.entity';
import { AdminGuard } from './../common/admin/admin.guard';
import { AuthGuard } from './../auth/jwt/jwt.guard';
import { ConcertService } from './concert.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { ConcertEntity } from 'src/entity/concert.entity';
import { CreateConcertDto } from 'src/common/dtos/create-concert.dto';
import { UpdateConcertDto } from 'src/common/dtos/update-concert.dto';

@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async createConcert(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateConcertDto,
  ): Promise<ConcertEntity> {
    return this.concertService.createConcert(user, dto);
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async getConcert(
    @Body('concertId') concertId: number,
  ): Promise<ConcertEntity> {
    return this.concertService.getConcert(concertId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async updateConcert(
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateConcertDto,
    @Param('id') id: number,
  ): Promise<ConcertEntity> {
    return this.concertService.updateConcert(user, dto, id);
  }
}
