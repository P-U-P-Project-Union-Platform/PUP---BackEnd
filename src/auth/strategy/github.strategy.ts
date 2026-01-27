import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor() {
        super({
            clientID: 'Iv23liqnWRfBBhpkjFbi', // 깃허브에서 발급받은 client ID
            clientSecret: '2875cd2bf2d5eaec5420b6dbb841099c8e178a93', // 깃허브에서 발급받은 client secret
            callbackURL: 'http://localhost:3000/auth/github/callback', // 깃허브에 등록한 callback URL
            scope: ['user:email'], // 요청할 권한
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const user = {
            profile,
            accessToken,
        };
        done(null, user);
    }
}