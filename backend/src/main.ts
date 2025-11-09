import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

let app = null;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );

    app.setGlobalPrefix("api");

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
      .addTag("incidents", "Security incident management")
      .addTag("threats", "Threat intelligence indicators")
      .addTag("vulnerabilities", "Vulnerability management")
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
      swaggerOptions: {
        persistAuthorization: true,
      },
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js",
      ],
      customCssUrl: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
      ],
    });

    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  const expressApp = await bootstrap();
  return expressApp(req, res);
}

// For local development
if (require.main === module) {
  bootstrap().then(async () => {
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  });
}
