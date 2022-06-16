import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  try {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
      .setTitle('Transactions Api')
      .setVersion('1.0.0')
      .build();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    const port = 3000;
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
  } catch (e) {
    console.log('Failed to connect to database');
  }
}

bootstrap();
