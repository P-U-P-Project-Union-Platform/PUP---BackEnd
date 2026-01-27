import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLikeDto } from './dto/create-like.dto';

@ApiTags('Likes')
@Controller('likes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ApiOperation({ summary: '좋아요 토글' })
  async toggle(@Req() req, @Body() createLikeDto: CreateLikeDto) {
    const result = await this.likesService.toggle(req.user.id, createLikeDto);
    return {
      success: true,
      data: {
        isLiked: result.isLiked,
        likesCount: result.likesCount,
      },
      message: result.message,
    };
  }
}
