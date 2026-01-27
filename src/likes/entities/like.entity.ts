import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TargetType {
  PROJECT = 'project',
  COMMUNITY = 'community',
  RECRUIT = 'recruit',
}

@Entity('likes')
@Unique(['userId', 'targetType', 'targetId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TargetType,
    name: 'target_type',
  })
  targetType: TargetType;

  @Column({ name: 'target_id' })
  targetId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
