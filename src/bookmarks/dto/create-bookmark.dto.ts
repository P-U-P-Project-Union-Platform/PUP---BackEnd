import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TargetType } from '../../likes/entities/like.entity';

export class CreateBookmarkDto {
  @ApiProperty({ enum: TargetType })
  @IsEnum(TargetType)
  targetType: TargetType;

  @ApiProperty()
  @IsString()
  targetId: string;
}