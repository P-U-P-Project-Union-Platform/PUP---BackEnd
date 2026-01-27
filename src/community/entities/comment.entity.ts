import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CommunityPost } from './community-post.entity';
import { RecruitPost } from '../../recruit/entities/recruit-post.entity';

export enum PostType {
  COMMUNITY = 'community',
  RECRUIT = 'recruit',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    name: 'post_type',
  })
  postType: PostType;

  @Column({ name: 'post_id' })
  postId: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ nullable: true, name: 'parent_id' })
  parentId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => CommunityPost, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'post_id' })
  communityPost: CommunityPost;

  @ManyToOne(() => RecruitPost, (post) => post.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'post_id' })
  recruitPost: RecruitPost;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
}