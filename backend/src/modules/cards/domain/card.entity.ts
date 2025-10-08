import { User } from '../../../modules/users/domain/user.entity';

export class Card {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public columnId: string,
    public boardId: string,
    public assignedTo: string | null,
    public createdBy: Pick<User, 'id' | 'name' | 'email' | 'avatar'>,
    public priority: 'low' | 'medium' | 'high',
    public tags: string[],
    public createdAt: Date,
    public dueDate: Date | null,
    public updatedAt: Date,
  ) {}

  moveToColumn(newColumnId: string) {
    this.columnId = newColumnId;
    this.updatedAt = new Date();
  }

  assignUser(userId: string) {
    this.assignedTo = userId;
    this.updatedAt = new Date();
  }
}
