import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';
import { Project } from '../projects/entities/project.entity';
import { CommunityPost } from '../community/entities/community-post.entity';
import { RecruitPost } from '../recruit/entities/recruit-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark, Project, CommunityPost, RecruitPost]),
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
