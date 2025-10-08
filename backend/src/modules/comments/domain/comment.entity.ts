export class Comment {
  constructor(
    public readonly id: string,
    public readonly cardId: string,
    public readonly userId: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateContent(newContent: string) {
    this.content = newContent;
    this.updatedAt = new Date();
  }
}
