import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecruitPost } from './recruit-post.entity';
import { User } from '../../users/entities/user.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recruit_id' })
  recruitId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  position: string;

  @Column('text', { nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RecruitPost, (recruit) => recruit.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recruit_id' })
  recruit: RecruitPost;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}