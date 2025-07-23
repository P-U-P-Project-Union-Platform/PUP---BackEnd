import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsIn,
    IsDateString,
} from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty({ message: '제목은 필수입니다.' })
    @IsString({ message: '제목은 문자열이어야 합니다.' })
    title: string;

    @IsNotEmpty({ message: '설명은 필수입니다.' })
    @IsString({ message: '설명은 문자열이어야 합니다.' })
    description: string;

    @IsNotEmpty({ message: '카테고리는 필수입니다.' })
    @IsString({ message: '카테고리는 문자열이어야 합니다.' })
    category: string;

    @IsNumber({}, { message: '소유자 ID는 숫자여야 합니다.' })
    ownerId: number; // 현재 로그인한 사용자의 ID (인증 미들웨어에서 추출 가능)

    @IsOptional()
    @IsArray({ message: '필수 기술은 배열이어야 합니다.' })
    @IsString({ each: true, message: '각 기술은 문자열이어야 합니다.' })
    requiredSkills?: string[];

    @IsOptional()
    @IsDateString({}, { message: '시작일은 유효한 날짜 형식이어야 합니다.' })
    startDate?: string;

    @IsOptional()
    @IsDateString({}, { message: '종료일은 유효한 날짜 형식이어야 합니다.' })
    endDate?: string;
}