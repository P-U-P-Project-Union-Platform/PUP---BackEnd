import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. DTO의 유효성 검사를 위해 전역 ValidationPipe 활성화
  // 이 부분은 app.listen() 호출 전에 한 번만 설정하면 됩니다.
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // DTO에 정의되지 않은 속성은 제거
        forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있을 경우 에러 발생
        transform: true, // 요청 데이터를 DTO 타입으로 자동 변환 (예: '123' -> 123)
        transformOptions: {
          enableImplicitConversion: true, // 암시적 타입 변환 허용 (예: string to number in @Param)
        },
      }),
  );

  // 2. 환경 변수에서 포트를 가져오거나 기본값으로 3000 사용
  const port = process.env.PORT || 3000;

  // 3. 애플리케이션 시작
  await app.listen(port);

  // 4. 서버 주소를 터미널에 출력
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();