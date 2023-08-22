import { UserEntity } from 'src/entity/user.entity';
import { ChatsService } from './chats.service';
import { ChatEntity } from './../entity/chat.entity';
import { Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinEntity } from 'src/entity/join.entity';
import { AuthGuard } from './../auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { WsJwtGuard } from 'src/auth/jwt/jwt.wsguard';
@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private logger = new Logger('chat');

  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly chatsService: ChatsService,
    @InjectRepository(JoinEntity)
    private readonly joinRepository: Repository<JoinEntity>,
  ) {
    this.logger.log('constructor');
  }
  afterInit() {
    this.logger.log('init');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconneted: ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @CurrentUser() user: UserEntity,
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(roomId);
    console.log(user, '대체 왜 언디파인...');
    await this.chatsService.joinUesr(user, roomId);
    const joinUserList = await this.chatsService.joinUserList(roomId);
    socket.to(roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User ${user.id} joined room ${roomId}`);
    return joinUserList;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @CurrentUser() user: UserEntity,
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(roomId);
    await this.chatsService.leaveUser(user, roomId);
    const joinUserList = await this.chatsService.joinUserList(roomId);
    socket.to(roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User ${user.id} leaved room ${roomId}`);
    return joinUserList;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @CurrentUser() user: UserEntity,
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, message } = data;
    const chat = await this.chatsService.createChat(user, roomId, message);
    socket.broadcast.to(roomId).emit('message', chat);
    return chat;
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(roomId);
    const joinUserList = await this.chatsService.joinUserList(roomId);
    socket.to(roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User joined room ${roomId}`);
    return joinUserList;
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(roomId);
    const joinUserList = await this.chatsService.joinUserList(roomId);
    socket.to(roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User leaved room ${roomId}`);
    return joinUserList;
  }
}
