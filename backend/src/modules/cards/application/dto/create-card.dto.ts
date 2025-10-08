import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum CardPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export const AllowedTags = [
  'bug',
  'feature',
  'design',
  'urgent',
  'research',
] as const;
export type AllowedTag = (typeof AllowedTags)[number];

export class CreateCardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  columnId: string;

  @IsString()
  boardId: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsString()
  createdBy: string;

  // Priority must be one of the enum values
  @IsEnum(CardPriority)
  priority: CardPriority;

  // Tags only from the allowed list
  @IsOptional()
  @IsArray()
  @IsIn(AllowedTags, { each: true })
  tags?: AllowedTag[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
