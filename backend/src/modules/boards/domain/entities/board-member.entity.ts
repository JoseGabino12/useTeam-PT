import { User } from '../../../../modules/users/domain/user.entity';

export class BoardMember {
  constructor(
    public readonly userId: string,
    public readonly boardId: string,
    public user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>,
    public role: 'owner' | 'editor' | 'viewer',
    public joinedAt: Date,
  ) {}
}
