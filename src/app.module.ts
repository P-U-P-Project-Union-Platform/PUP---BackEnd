import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';

const entities = []; // 아직 엔티티가 없다면 비워두세요.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DATABASE_TYPE', 'mysql') as any,
        host: configService.get<string>('DATABASE_HOST')!,         // <-- Add '!' here
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME')!, // <-- Add '!' here
        password: configService.get<string>('DATABASE_PASSWORD')!, // <-- Add '!' here
        database: configService.get<string>('DATABASE_NAME')!,     // <-- Add '!' here
        entities: entities,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}