export class Column {
  constructor(
    public readonly id: string,
    public name: string,
    public boardId: string,
    public order: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  rename(newName: string) {
    this.name = newName;
    this.updatedAt = new Date();
  }
}
