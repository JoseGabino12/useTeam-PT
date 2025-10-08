import { User } from '../../../../modules/users/domain/user.entity';
import { BoardMember } from './board-member.entity';

export class Board {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public members: BoardMember[],
    public createdBy: Pick<User, 'id' | 'name' | 'email' | 'avatar'>,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  addMember(member: BoardMember) {
    this.members.push(member);
  }

  changeName(newName: string) {
    this.name = newName;
    this.updatedAt = new Date();
  }

  toPlain() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      members: this.members,
      createdBy: {
        id: this.createdBy.id,
        name: this.createdBy.name,
        email: this.createdBy.email,
        avatar: this.createdBy.avatar,
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
