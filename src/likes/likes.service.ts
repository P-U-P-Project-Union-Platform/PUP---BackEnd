import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, TargetType } from './entities/like.entity';
import { Project } from '../projects/entities/project.entity';
import { CommunityPost } from '../community/entities/community-post.entity';
import { RecruitPost } from '../recruit/entities/recruit-post.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(CommunityPost)
    private communityRepository: Repository<CommunityPost>,
    @InjectRepository(RecruitPost)
    private recruitRepository: Repository<RecruitPost>,
  ) {}

  async toggle(userId: string, createLikeDto: CreateLikeDto) {
    const { targetType, targetId } = createLikeDto;

    await this.validateTarget(targetType, targetId);

    const existingLike = await this.likeRepository.findOne({
      where: { userId, targetType, targetId },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      await this.decrementLikes(targetType, targetId);

      const likesCount = await this.getLikesCount(targetType, targetId);

      return {
        isLiked: false,
        likesCount,
        message: '좋아요를 취소했습니다.',
      };
    } else {
      const like = this.likeRepository.create({
        userId,
        targetType,
        targetId,
      });
      await this.likeRepository.save(like);
      await this.incrementLikes(targetType, targetId);

      const likesCount = await this.getLikesCount(targetType, targetId);

      return {
        isLiked: true,
        likesCount,
        message: '좋아요를 눌렀습니다.',
      };
    }
  }

  private async validateTarget(targetType: TargetType, targetId: string) {
    let exists = false;

    switch (targetType) {
      case TargetType.PROJECT:
        exists = await this.projectRepository.exists({ where: { id: targetId } });
        break;
      case TargetType.COMMUNITY:
        exists = await this.communityRepository.exists({ where: { id: targetId } });
        break;
      case TargetType.RECRUIT:
        exists = await this.recruitRepository.exists({ where: { id: targetId } });
        break;
    }

    if (!exists) {
      throw new NotFoundException('대상을 찾을 수 없습니다.');
    }
  }

  private async incrementLikes(targetType: TargetType, targetId: string) {
    switch (targetType) {
      case TargetType.PROJECT:
        await this.projectRepository.increment({ id: targetId }, 'likes', 1);
        break;
      case TargetType.COMMUNITY:
        await this.communityRepository.increment({ id: targetId }, 'likes', 1);
        break;
      case TargetType.RECRUIT:
        await this.recruitRepository.increment({ id: targetId }, 'likes', 1);
        break;
    }
  }

  private async decrementLikes(targetType: TargetType, targetId: string) {
    switch (targetType) {
      case TargetType.PROJECT:
        await this.projectRepository.decrement({ id: targetId }, 'likes', 1);
        break;
      case TargetType.COMMUNITY:
        await this.communityRepository.decrement({ id: targetId }, 'likes', 1);
        break;
      case TargetType.RECRUIT:
        await this.recruitRepository.decrement({ id: targetId }, 'likes', 1);
        break;
    }
  }

  private async getLikesCount(targetType: TargetType, targetId: string): Promise<number> {
    let target;

    switch (targetType) {
      case TargetType.PROJECT:
        target = await this.projectRepository.findOne({ where: { id: targetId } });
        break;
      case TargetType.COMMUNITY:
        target = await this.communityRepository.findOne({ where: { id: targetId } });
        break;
      case TargetType.RECRUIT:
        target = await this.recruitRepository.findOne({ where: { id: targetId } });
        break;
    }

    return target?.likes || 0;
  }
}
