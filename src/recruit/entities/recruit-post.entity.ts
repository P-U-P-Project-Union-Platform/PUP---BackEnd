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
import { RecruitPosition } from './recruit-position.entity';
import { Application } from './application.entity';
import { Comment } from '../../community/entities/comment.entity';
import { ProjectCategory } from '../../projects/entities/project.entity';

export enum RecruitStatus {
  RECRUITING = 'recruiting',
  CLOSED = 'closed',
}

@Entity('recruit_posts')
export class RecruitPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_title' })
  projectTitle: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
  })
  category: ProjectCategory;

  @Column('simple-array', { name: 'tech_stack' })
  techStack: string[];

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true, name: 'github_url' })
  githubUrl: string;

  @Column({
    type: 'enum',
    enum: RecruitStatus,
    default: RecruitStatus.RECRUITING,
  })
  status: RecruitStatus;

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

  @ManyToOne(() => User, (user) => user.recruitPosts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => RecruitPosition, (position) => position.recruit)
  positions: RecruitPosition[];

  @OneToMany(() => Application, (application) => application.recruit)
  applications: Application[];

  @OneToMany(() => Comment, (comment) => comment.recruitPost)
  comments: Comment[];
}