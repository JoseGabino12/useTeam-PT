import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  cardId: string;

  @IsString()
  userId: string;

  @IsString()
  content: string;
}
