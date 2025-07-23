import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
    @IsNumber({}, { message: '멤버 ID는 숫자여야 합니다.' })
    @IsNotEmpty({ message: '멤버 ID는 필수입니다.' })
    memberId: number;
}