import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto'; // 새로 추가된 DTO 임포트

@Controller('projects') // 기본 경로: /projects
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 새로운 프로젝트를 생성합니다.
   * POST /projects
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // 성공 시 201 Created 응답
  create(@Body() createProjectDto: CreateProjectDto) {
    // 실제 환경에서는 여기서 ownerId를 인증된 사용자 정보에서 가져와야 합니다.
    // createProjectDto.ownerId = req.user.id; (예시: Guard & Passport 사용 시)
    return this.projectsService.create(createProjectDto);
  }

  /**
   * 모든 프로젝트를 조회합니다.
   * GET /projects
   */
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  /**
   * 특정 ID의 프로젝트를 조회합니다.
   * GET /projects/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id); // 문자열 ID를 숫자로 변환
  }

  /**
   * 특정 ID의 프로젝트를 업데이트합니다.
   * PATCH /projects/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    // 권한 확인 로직 추가 필요: 프로젝트 소유자만 수정 가능
    return this.projectsService.update(+id, updateProjectDto);
  }

  /**
   * 특정 ID의 프로젝트를 삭제합니다.
   * DELETE /projects/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 성공 시 204 No Content 응답
  remove(@Param('id') id: string) {
    // 권한 확인 로직 추가 필요: 프로젝트 소유자만 삭제 가능
    this.projectsService.remove(+id);
  }

  // --- 팀원 모집 관련 API ---
  /**
   * 특정 프로젝트에 팀원 추가
   * POST /projects/:id/members
   * Body: { "memberId": 123 }
   * @Body() addMemberDto: AddMemberDto 로 변경하여 유효성 검사 및 타입 안정성 확보
   */
  @Post(':id/members')
  addMember(@Param('id') projectId: string, @Body() addMemberDto: AddMemberDto) {
    // addMemberDto.memberId를 사용하여 안전하게 멤버 ID 전달
    return this.projectsService.addTeamMember(+projectId, addMemberDto.memberId);
  }

  /**
   * 특정 프로젝트에서 팀원 제거
   * DELETE /projects/:id/members/:memberId
   */
  @Delete(':id/members/:memberId')
  removeMember(@Param('id') projectId: string, @Param('memberId') memberId: string) {
    return this.projectsService.removeTeamMember(+projectId, +memberId);
  }
}