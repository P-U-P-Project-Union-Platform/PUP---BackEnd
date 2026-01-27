import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TargetType } from '../entities/like.entity';

export class CreateLikeDto {
  @ApiProperty({ enum: TargetType })
  @IsEnum(TargetType)
  targetType: TargetType;

  @ApiProperty()
  @IsString()
  targetId: string;
}