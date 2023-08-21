import { SuccessInterceptor } from './../common/interceptor/interceptor';
import { UpdateRoomDto } from './../common/dtos/update-room.dto';
import { AdminGuard } from './../common/admin/admin.guard';
import { RoomEntity } from './../entity/room.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AuthGuard } from './../auth/jwt/jwt.guard';
import { RoomService } from './room.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { CreateRoomDto } from 'src/common/dtos/create-room.dto';

@Controller('room')
@UseInterceptors(SuccessInterceptor)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async createRoom(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateRoomDto,
  ): Promise<RoomEntity> {
    return this.roomService.createRoom(user, dto);
  }

  @Get()
  async getAllRoom() {
    return this.roomService.getAllRoom();
  }

  @Put(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async updateRoomData(
    @CurrentUser() user: UserEntity,
    @Body() dto: UpdateRoomDto,
    @Param('id') id: number,
  ): Promise<RoomEntity> {
    return this.roomService.updateRoomData(user, dto, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async deletRoom(@CurrentUser() user: UserEntity, @Param('id') id: number) {
    return this.roomService.deletRoom(user, id);
  }

  @Get('/:id/chat')
  async getChatList(@Param('id') roomId: string, @Query() lastChatTime: Date) {
    return this.roomService.getChatList(roomId, lastChatTime);
  }
}
