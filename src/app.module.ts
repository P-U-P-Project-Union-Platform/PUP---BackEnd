import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommunityModule } from './community/community.module';
import { RecruitModule } from './recruit/recruit.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import * as path from "node:path";


// 엔티티가 없으면 빈 배열 유지
const entities = [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev'
          ? path.resolve(process.cwd(), '.env.dev')
          : path.resolve(process.cwd(), '.env'),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DATABASE_TYPE', 'mysql') as any,
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: entities,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),

    ProjectsModule,

    AuthModule,

    UsersModule,

    CommunityModule,

    RecruitModule,

    LikesModule,

    BookmarksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}