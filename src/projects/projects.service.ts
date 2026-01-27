import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectCategory, ProjectStatus } from './entities/project.entity';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

@Injectable()
export class ProjectsService {
  private projects: Project[] = []; // 임시 데이터 저장소

  /**
   * 새로운 프로젝트를 생성합니다.
   */
  create(createProjectDto: CreateProjectDto): Project {
    const newProject: Project = {
      id: uuidv4(), // Generate UUID
      title: createProjectDto.title,
      description: createProjectDto.description,
      thumbnail: createProjectDto.thumbnail || null,
      category: createProjectDto.category as ProjectCategory,
      techStack: createProjectDto.requiredSkills || [],
      tags: [], // Assuming tags are not part of CreateProjectDto for now
      githubUrl: createProjectDto.githubUrl || null,
      startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : null,
      endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
      status: createProjectDto.status || ProjectStatus.IN_PROGRESS, // Default status
      views: 0,
      likes: 0,
      authorId: createProjectDto.ownerId.toString(), // Convert number to string
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [], // Initialize members as an empty array
      positions: [], // Initialize positions as an empty array
    };
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
  findOne(id: string): Project { // Change id type to string
    const project = this.projects.find(proj => proj.id === id);
    if (!project) {
      throw new NotFoundException(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
    }
    return project;
  }

  /**
   * 특정 ID의 프로젝트를 업데이트
   */
  update(id: string, updateProjectDto: UpdateProjectDto): Project { // Change id type to string
    const projectIndex = this.projects.findIndex(proj => proj.id === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
    }

    const existingProject = this.projects[projectIndex];
    const updatedProject: Project = {
      ...existingProject,
      ...updateProjectDto,
      startDate: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : existingProject.startDate,
      endDate: updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : existingProject.endDate,
      updatedAt: new Date(),
      category: updateProjectDto.category ? (updateProjectDto.category as ProjectCategory) : existingProject.category,
      status: updateProjectDto.status ? (updateProjectDto.status as ProjectStatus) : existingProject.status,
    };

    this.projects[projectIndex] = updatedProject;
    return updatedProject;
  }

  /**
   * 특정 ID의 프로젝트를 삭제
   */
  remove(id: string): void { // Change id type to string
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
  addTeamMember(projectId: string, memberId: string): Project { // Change id types to string
    const project = this.findOne(projectId); // 프로젝트 존재 여부 확인
    // Assuming members is an array of ProjectMember objects, and we're adding a mock ProjectMember
    // This part needs to be refined if ProjectMember has more properties or relationships
    if (!project.members.some(member => member.id === memberId)) {
      project.members.push({ id: memberId } as any); // Mock ProjectMember
      project.updatedAt = new Date();
    }
    return project;
  }

  /**
   * 특정 프로젝트에서 팀원을 제거
   */
  removeTeamMember(projectId: string, memberId: string): Project { // Change id types to string
    const project = this.findOne(projectId);
    const initialLength = project.members.length;
    project.members = project.members.filter(member => member.id !== memberId);
    if (project.members.length < initialLength) {
      project.updatedAt = new Date();
    }
    return project;
  }
}