import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GithubStrategy } from './strategy/github.strategy';

@Module({
  controllers: [AuthController],
  imports: [PassportModule],
  providers: [AuthService, GithubStrategy],
})
export class AuthModule {}