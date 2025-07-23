export class Project {
    id: number;
    title: string;
    description: string;
    category: string;
    status: '모집 중' | '진행 중' | '완료';
    ownerId: number;

    recruitmentStatus: '모집 중' | '모집 완료' | '모집 중단';
    requiredSkills: string[];
    teamMembers: number[];

    // 선택 사항
    startDate?: Date;
    endDate?: Date;

    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<Project>) {
        Object.assign(this, partial);
        // 기본값 설정
        if (!this.status) this.status = '모집 중';
        if (!this.recruitmentStatus) this.recruitmentStatus = '모집 중';
        if (!this.teamMembers) this.teamMembers = [];
        if (!this.requiredSkills) this.requiredSkills = [];

        if (!this.createdAt) this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}