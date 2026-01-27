import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecruitPost } from './recruit-post.entity';

@Entity('recruit_positions')
export class RecruitPosition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recruit_id' })
  recruitId: string;

  @Column()
  name: string;

  @Column()
  count: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => RecruitPost, (recruit) => recruit.positions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recruit_id' })
  recruit: RecruitPost;
}