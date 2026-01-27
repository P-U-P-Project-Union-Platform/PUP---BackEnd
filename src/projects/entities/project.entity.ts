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
import { ProjectPosition } from './project-position.entity';
import { ProjectMember } from './project-member.entity';

export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  AI_ML = 'ai-ml',
  GAME = 'game',
  DESIGN = 'design',
  BACKEND = 'backend',
  DATA = 'data',
  ETC = 'etc',
}

export enum ProjectStatus {
  IN_PROGRESS = 'in_progress',
  RECRUITING = 'recruiting',
  COMPLETED = 'completed',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  thumbnail: string | null;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
  })
  category: ProjectCategory;

  @Column('simple-array')
  techStack: string[];

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true, name: 'github_url' })
  githubUrl: string | null;

  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate: Date | null;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate: Date | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.IN_PROGRESS,
  })
  status: ProjectStatus;

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

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'author_id' })
  author?: User;

  @OneToMany(() => ProjectPosition, (position) => position.project)
  positions: ProjectPosition[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];
}