import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // API prefix
  app.setGlobalPrefix("api");

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("One Billion API")
    .setDescription(
      "Backend API for One Billion Application - Site Monitoring & Security"
    )
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management")
    .addTag("sites", "Site monitoring")
    .addTag("agents", "Agent management")
    .addTag("agent", "Agent communication")
    .addTag("agent-install", "Agent installation")
    .addTag("onboarding", "User onboarding")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "One Billion API Documentation",
    customfavIcon: "https://nestjs.com/img/logo-small.svg",
    customCss: ".swagger-ui .topbar { display: none }",
  });

  const port = configService.get<number>("PORT", 3001);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
