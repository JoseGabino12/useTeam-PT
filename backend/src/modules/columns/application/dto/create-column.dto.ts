import { IsString, IsNumber } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  name: string;

  @IsString()
  boardId: string;

  @IsNumber()
  order: number;
}
