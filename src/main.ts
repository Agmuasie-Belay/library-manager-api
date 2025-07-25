import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors()

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

   // Run the seed service BEFORE starting the server
  const seeder = app.get(SeederService);
  await seeder.seed();

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Library Manager API')
    .setDescription('A REST API for managing a library system with books, members, and borrowing operations')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication operations')
    .addTag('books', 'Book management operations')
    .addTag('members', 'Member management operations')
    .addTag('borrow-records', 'Borrow and return operations')
    .addTag('genres', 'Genre management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Library Manager API is running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger documentation is available at http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
