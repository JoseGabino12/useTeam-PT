import { BoardRepositoryImpl } from '../../infrastructure/board.repository.impl';
import { UserRepositoryImpl } from 'src/modules/users/infrastructure/user.repository.impl';
import { BoardMember } from '../../domain/entities/board-member.entity';

export class AddBoardMemberUseCase {
  constructor(
    private readonly boardRepository: BoardRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl,
  ) {}

  async execute(boardId: string, userId: string, role: 'editor' | 'viewer') {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error('Board not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const member = new BoardMember(
      user.id,
      boardId,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      role,
      new Date(),
    );

    board.addMember(member);
    await this.boardRepository.update(board);

    return member;
  }
}
