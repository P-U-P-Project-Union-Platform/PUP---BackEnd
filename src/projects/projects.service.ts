import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  private projects: Project[] = []; // 임시 데이터 저장소
  private nextId = 1; // ID 자동 증가

  /**
   * 새로운 프로젝트를 생성합니다.
   */
  create(createProjectDto: CreateProjectDto): Project {
    const newProject = new Project({
      id: this.nextId++,
      ...createProjectDto,
      startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : undefined,
      endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : undefined,
    });
    this.projects.push(newProject);
    return newProject;
  }

  /**
   * 모든 프로젝트를 조회
   */
  findAll(): Project[] {
    return this.projects;
  }

  /**
   * 특정 ID의 프로젝트를 조회
   */
  findOne(id: number): Project {
    const project = this.projects.find(proj => proj.id === id);
    if (!project) {
      throw new NotFoundException(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  /**
   * 특정 ID의 프로젝트를 업데이트
   */
  update(id: number, updateProjectDto: UpdateProjectDto): Project {
    const projectIndex = this.projects.findIndex(proj => proj.id === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
    }

    const updatedProject = new Project({
      ...this.projects[projectIndex],
      ...updateProjectDto,
      startDate: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : this.projects[projectIndex].startDate,
      endDate: updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : this.projects[projectIndex].endDate,
      updatedAt: new Date(),
    });

    this.projects[projectIndex] = updatedProject;
    return updatedProject;
  }

  /**
   * 특정 ID의 프로젝트를 삭제
   */
  remove(id: number): void {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(proj => proj.id !== id);
    if (this.projects.length === initialLength) {
      throw new NotFoundException(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
  }

  // --- 팀원 모집 관련 서비스 로직 ---

  /**
   * 특정 프로젝트에 팀원을 추가
   */
  addTeamMember(projectId: number, memberId: number): Project {
    const project = this.findOne(projectId); // 프로젝트 존재 여부 확인
    if (!project.teamMembers.includes(memberId)) {
      project.teamMembers.push(memberId);
      project.updatedAt = new Date();
    }
    return project;
  }

  /**
   * 특정 프로젝트에서 팀원을 제거
   */
  removeTeamMember(projectId: number, memberId: number): Project {
    const project = this.findOne(projectId);
    const initialLength = project.teamMembers.length;
    project.teamMembers = project.teamMembers.filter(id => id !== memberId);
    if (project.teamMembers.length < initialLength) {
      project.updatedAt = new Date();
    }
    return project;
  }
}