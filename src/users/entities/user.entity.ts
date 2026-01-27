import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { CommunityPost } from '../../community/entities/community-post.entity';
import { RecruitPost } from '../../recruit/entities/recruit-post.entity';
import { Comment } from '../../community/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, name: 'profile_image' })
  profileImage: string;

  @Column({ unique: true, name: 'github_id' })
  githubId: string;

  @Column({ name: 'github_url' })
  githubUrl: string;

  @Column({ nullable: true, name: 'blog_url' })
  blogUrl: string;

  @Column({ nullable: true, name: 'portfolio_url' })
  portfolioUrl: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.author)
  projects: Project[];

  @OneToMany(() => CommunityPost, (post) => post.author)
  communityPosts: CommunityPost[];

  @OneToMany(() => RecruitPost, (recruit) => recruit.author)
  recruitPosts: RecruitPost[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];
}