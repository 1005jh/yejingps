import { UserEntity } from 'src/entity/user.entity';
import { ChatsService } from './chats.service';
import { ChatEntity } from './../entity/chat.entity';
import { Socket } from 'socket.io';
import { ExecutionContext, Logger, UseGuards } from '@nestjs/common';
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
import { CurrentUser, WsUser } from 'src/common/decorator/user.decorator';
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
    @WsUser() user: UserEntity,
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(data.roomId);
    console.log(user, 'user 제발 나와주세요');
    await this.chatsService.joinUesr(user, data.roomId);
    const joinUserList = await this.chatsService.joinUserList(data.roomId);
    socket.to(data.roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User ${user.id} joined room ${data.roomId}`);
    return joinUserList;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @WsUser() user: UserEntity,
    // @MessageBody() roomId: string,
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(data.roomId);
    await this.chatsService.leaveUser(user, data.roomId);
    const joinUserList = await this.chatsService.joinUserList(data.roomId);
    socket.to(data.roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User ${user.id} leaved room ${data.roomId}`);
    return joinUserList;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @WsUser() user: UserEntity,
    @MessageBody()
    data: { roomId: string; message: string; isAtLocation: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat(user, data);
    socket.broadcast.to(data.roomId).emit('message', chat);
    return chat;
  }

  @SubscribeMessage('join')
  async handleJoin(
    // @MessageBody() roomId: string,
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(data.roomId);
    const joinUserList = await this.chatsService.joinUserList(data.roomId);
    socket.to(data.roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User joined room ${data.roomId}`);
    return joinUserList;
  }

  @SubscribeMessage('leave')
  async handleLeave(
    // @MessageBody() roomId: string,
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(data.roomId);
    const joinUserList = await this.chatsService.joinUserList(data.roomId);
    socket.to(data.roomId).emit('updateUserList', joinUserList);
    this.logger.log(`User leaved room ${data.roomId}`);
    return joinUserList;
  }
}
