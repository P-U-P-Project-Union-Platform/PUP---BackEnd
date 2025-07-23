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

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsIn(['모집 중', '진행 중', '완료'], {
        message: '프로젝트 상태는 "모집 중", "진행 중", "완료" 중 하나여야 합니다.',
    })
    status?: '모집 중' | '진행 중' | '완료';

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