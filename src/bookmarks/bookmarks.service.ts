import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { TargetType } from '../likes/entities/like.entity';
import { Project } from '../projects/entities/project.entity';
import { CommunityPost } from '../community/entities/community-post.entity';
import { RecruitPost } from '../recruit/entities/recruit-post.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(CommunityPost)
    private communityRepository: Repository<CommunityPost>,
    @InjectRepository(RecruitPost)
    private recruitRepository: Repository<RecruitPost>,
  ) {}

  async toggle(userId: string, createBookmarkDto: CreateBookmarkDto) {
    const { targetType, targetId } = createBookmarkDto;

    await this.validateTarget(targetType, targetId);

    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { userId, targetType, targetId },
    });

    if (existingBookmark) {
      await this.bookmarkRepository.remove(existingBookmark);
      return {
        isBookmarked: false,
        message: '스크랩을 취소했습니다.',
      };
    } else {
      const bookmark = this.bookmarkRepository.create({
        userId,
        targetType,
        targetId,
      });
      await this.bookmarkRepository.save(bookmark);
      return {
        isBookmarked: true,
        message: '스크랩했습니다.',
      };
    }
  }

  async findAll(userId: string, targetType?: TargetType, page = 1, limit = 12) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .where('bookmark.userId = :userId', { userId });

    if (targetType) {
      queryBuilder.andWhere('bookmark.targetType = :targetType', { targetType });
    }

    const [bookmarks, total] = await queryBuilder
      .orderBy('bookmark.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const bookmarksWithTargets = await Promise.all(
      bookmarks.map(async (bookmark) => {
        let target;
        switch (bookmark.targetType) {
          case TargetType.PROJECT:
            target = await this.projectRepository.findOne({
              where: { id: bookmark.targetId },
              relations: ['author'],
            });
            break;
          case TargetType.COMMUNITY:
            target = await this.communityRepository.findOne({
              where: { id: bookmark.targetId },
              relations: ['author'],
            });
            break;
          case TargetType.RECRUIT:
            target = await this.recruitRepository.findOne({
              where: { id: bookmark.targetId },
              relations: ['author'],
            });
            break;
        }
        return {
          id: bookmark.id,
          target,
          createdAt: bookmark.createdAt,
        };
      }),
    );

    return {
      bookmarks: bookmarksWithTargets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
}