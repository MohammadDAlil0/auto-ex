import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { badRequestExceptionFilter, httpExceptionFilter, SequelizeExceptionFilter } from './exceptions/sequelize-exception.filter';
import { CustomResponseInterceptor } from './common/interceptors/custom.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Auto-Ex')
  .setDescription('The Auto-Ex APIs')
  .setVersion('1.0')
  .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config, {
    autoTagControllers: true 
  });
  SwaggerModule.setup('api', app, documentFactory);

  // Global filters and interceptors
  app.useGlobalFilters(new httpExceptionFilter(), new SequelizeExceptionFilter(), new badRequestExceptionFilter());
  app.useGlobalInterceptors(new CustomResponseInterceptor())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
