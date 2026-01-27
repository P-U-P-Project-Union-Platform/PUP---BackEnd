import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { TargetType } from '../likes/entities/like.entity';

@ApiTags('Bookmarks')
@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({ summary: '스크랩 토글' })
  async toggle(@Req() req, @Body() createBookmarkDto: CreateBookmarkDto) {
    const result = await this.bookmarksService.toggle(req.user.id, createBookmarkDto);
    return {
      success: true,
      data: {
        isBookmarked: result.isBookmarked,
      },
      message: result.message,
    };
  }

  @Get()
  @ApiOperation({ summary: '스크랩 목록 조회' })
  async findAll(
    @Req() req,
    @Query('type') type?: TargetType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.bookmarksService.findAll(req.user.id, type, page, limit);
    return {
      success: true,
      data: result,
    };
  }
}