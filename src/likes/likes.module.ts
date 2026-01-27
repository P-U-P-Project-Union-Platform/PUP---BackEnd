import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './entities/like.entity';
import { Project } from '../projects/entities/project.entity';
import { CommunityPost } from '../community/entities/community-post.entity';
import { RecruitPost } from '../recruit/entities/recruit-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Project, CommunityPost, RecruitPost]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
