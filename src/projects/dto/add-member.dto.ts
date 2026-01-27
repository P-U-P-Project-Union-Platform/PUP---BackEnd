import { IsString, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
    @IsString({ message: '멤버 ID는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '멤버 ID는 필수입니다.' })
    memberId: string;
}