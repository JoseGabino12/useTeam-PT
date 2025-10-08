import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class BoardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // User joins a board room
  @SubscribeMessage('joinBoard')
  async handleJoinBoard(
    @MessageBody() boardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(boardId);
    console.log(`👥 User ${client.id} joined board ${boardId}`);
  }

  // User creates a new card
  @SubscribeMessage('cardCreated')
  handleCardCreated(@MessageBody() payload: { boardId: string; card: any }) {
    this.server.to(payload.boardId).emit('cardCreated', payload.card);
  }

  // User moves a card
  @SubscribeMessage('cardMoved')
  handleCardMoved(
    @MessageBody()
    payload: {
      boardId: string;
      cardId: string;
      newColumnId: string;
    },
  ) {
    this.server.to(payload.boardId).emit('cardMoved', payload);
  }

  // User adds a comment
  @SubscribeMessage('commentAdded')
  handleCommentAdded(
    @MessageBody() payload: { boardId: string; cardId: string; comment: any },
  ) {
    this.server.to(payload.boardId).emit('commentAdded', payload);
  }
}
