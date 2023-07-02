import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import * as cookieParser from 'cookie-parser';

const fs = require('fs');
async function bootstrap() {
  const options = {};
  // const app = await NestFactory.create(AppModule);
  if (process.env.LOCAL === 'true') {
    options['httpsOptions'] = {
      key: fs.readFileSync('.cert/key.pem', 'utf-8'),
      cert: fs.readFileSync('.cert/cert.pem', 'utf-8'),
    };
  }
  const app = await NestFactory.create(AppModule, options);
  app.enableCors({
    origin: [
      'https://local.chatgps.com:4000',
      'http://local.chatgps.com:4000',
      'http://localhost:3000',
      'http://localhost:4000',
      'https://local.chatgps.com:3000',
      'http://local.chatgps.com:3000',
    ],
    allowedHeaders: ['Content-Type', 'Authorization', 'cookies'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      //     whitelist: true, //decorator 없는 property object 거름
      //     forbidNonWhitelisted: true, //이상한 값 요청오면 요청 막음 보안상승
      transform: true, //id값 url로 보내면 string인데 이걸 원하는걸로 변환시켜주는옵션
      //     // transformOptions: {
      //     //   enableImplicitConversion: true,
      // },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(4000);
}
bootstrap();
