import { Injectable } from '@nestjs/common';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { UpdateRecruitDto } from './dto/update-recruit.dto';

@Injectable()
export class RecruitService {
  create(createRecruitDto: CreateRecruitDto) {
    return 'This action adds a new recruit';
  }

  findAll() {
    return `This action returns all recruit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recruit`;
  }

  update(id: number, updateRecruitDto: UpdateRecruitDto) {
    return `This action updates a #${id} recruit`;
  }

  remove(id: number) {
    return `This action removes a #${id} recruit`;
  }
}
