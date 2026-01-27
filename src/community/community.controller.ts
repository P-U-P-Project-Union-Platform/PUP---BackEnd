import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  async findAll(@Query() query: any) {
    const result = await this.communityService.findAll(query);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세 조회' })
  async findOne(@Param('id') id: string) {
    const post = await this.communityService.findOne(id);
    return {
      success: true,
      data: post,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 작성' })
  async create(@Req() req, @Body() createCommunityDto: CreateCommunityDto) {
    const post = await this.communityService.create(req.user.id, createCommunityDto);
    return {
      success: true,
      data: post,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 수정' })
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    const post = await this.communityService.update(id, req.user.id, updateCommunityDto);
    return {
      success: true,
      data: post,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 삭제' })
  async remove(@Param('id') id: string, @Req() req) {
    await this.communityService.remove(id, req.user.id);
    return {
      success: true,
      message: '게시글이 삭제되었습니다.',
    };
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 작성' })
  async createComment(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { content: string; parentId?: string },
  ) {
    const comment = await this.communityService.createComment(
      id,
      req.user.id,
      body.content,
      body.parentId,
    );
    return {
      success: true,
      data: comment,
    };
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제' })
  async removeComment(@Param('commentId') commentId: string, @Req() req) {
    await this.communityService.removeComment(commentId, req.user.id);
    return {
      success: true,
      message: '댓글이 삭제되었습니다.',
    };
  }
}