import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommunityCategory } from '../entities/community-post.entity';

export class CreateCommunityDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @ApiProperty({ enum: CommunityCategory })
  @IsEnum(CommunityCategory)
  category: CommunityCategory;
}
