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
import { Comment } from './comment.entity';

export enum CommunityCategory {
  FREE = 'free',
  QUESTION = 'question',
  INFO = 'info',
  REVIEW = 'review',
}

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: CommunityCategory,
  })
  category: CommunityCategory;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ name: 'author_id' })
  authorId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.communityPosts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.communityPost)
  comments: Comment[];
}
