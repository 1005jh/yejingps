import { SuccessInterceptor } from './../common/interceptor/interceptor';
import { UserEntity } from 'src/entity/user.entity';
import { AdminGuard } from './../common/admin/admin.guard';
import { AuthGuard } from './../auth/jwt/jwt.guard';
import { ConcertService } from './concert.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { ConcertEntity } from 'src/entity/concert.entity';
import { CreateConcertDto } from 'src/common/dtos/create-concert.dto';
import { UpdateConcertDto } from 'src/common/dtos/update-concert.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('concert')
@UseInterceptors(SuccessInterceptor)
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createConcert(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateConcertDto,
    // @UploadedFile() file: Express.Multer.File,
  ): Promise<ConcertEntity> {
    return this.concertService.createConcert(user, dto);
  }

  @Get()
  async getConcert() {
    return this.concertService.getAllConcert();
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

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async remove(@Param('id') id: number) {
    return this.concertService.remove(id);
  }
}
