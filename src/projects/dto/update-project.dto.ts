import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import {
    IsOptional,
    IsArray,
    IsString,
    IsIn,
    IsNumber,
    IsDateString,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsIn(Object.values(ProjectStatus), {
        message: '유효하지 않은 프로젝트 상태입니다.',
    })
    status?: ProjectStatus;

    @IsOptional()
    @IsIn(['모집 중', '모집 완료', '모집 중단'], {
        message: '모집 상태는 "모집 중", "모집 완료", "모집 중단" 중 하나여야 합니다.',
    })
    recruitmentStatus?: '모집 중' | '모집 완료' | '모집 중단';

    @IsOptional()
    @IsArray({ message: '팀원 ID는 배열이어야 합니다.' })
    @IsNumber({}, { each: true, message: '각 팀원 ID는 숫자여야 합니다.' })
    teamMembers?: number[];
}