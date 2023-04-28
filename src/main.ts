import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that do not have a corresponding dto
      forbidNonWhitelisted: true // throw an error if a property that does not have a corresponding dto is sent
    })
  )

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('PokeAPI')
    .setDescription('The PokeAPI description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // Enable cors
  app.enableCors()

  // Initialize application
  await app.listen(4000)
}
bootstrap()
