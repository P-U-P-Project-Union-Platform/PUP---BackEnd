import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity';
import { Comment, PostType } from './entities/comment.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(CommunityPost)
    private postRepository: Repository<CommunityPost>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 20, category, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments');

    if (category) {
      queryBuilder.andWhere('post.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [posts, total] = await queryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const comments = await this.commentRepository.find({
      where: { postId: id, postType: PostType.COMMUNITY, parentId: IsNull() },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'ASC' },
    });

    post.views += 1;
    await this.postRepository.save(post);

    return { ...post, comments };
  }

  async create(userId: string, createCommunityDto: CreateCommunityDto) {
    const post = this.postRepository.create({
      ...createCommunityDto,
      authorId: userId,
    });

    const savedPost = await this.postRepository.save(post);
    return this.findOne(savedPost.id);
  }

  async update(id: string, userId: string, updateCommunityDto: UpdateCommunityDto) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('게시글을 수정할 권한이 없습니다.');
    }

    Object.assign(post, updateCommunityDto);
    await this.postRepository.save(post);

    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('게시글을 삭제할 권한이 없습니다.');
    }

    await this.postRepository.remove(post);
  }

  async createComment(postId: string, userId: string, content: string, parentId?: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const comment = this.commentRepository.create({
      content,
      postId,
      postType: PostType.COMMUNITY,
      authorId: userId,
      parentId,
    });

    return this.commentRepository.save(comment);
  }

  async removeComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentRepository.remove(comment);
  }
}