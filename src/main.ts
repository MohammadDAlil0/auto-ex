import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
