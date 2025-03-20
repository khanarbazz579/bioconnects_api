import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CanLogger } from './core/logger/logger.service';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { CanAuthGuard } from './core/auth/auth.guard';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { CanContextService, CanPermissionsGuard } from '@can/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LogLevel } from '@nestjs/common';
import * as bodyParser from 'body-parser';
/**
 * Boot the App
 */
bootstrap();

async function bootstrap() {
  // Create App Instance
  // const logLevel: LogLevel[] = ([process.env.APP_LOG_LEVEL] ?? [
  //   'error',
  // ]) as LogLevel[];
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: [...logLevel],
  });
  // Enable Cors
  app.enableCors();
  // Set Static Assests For MVC
  app.useStaticAssets(join(__dirname, '..', 'src', 'browser', 'public'));
  // Set Template Store Default Directory
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'browser', 'views'));
  // Set View Engine
  app.setViewEngine('hbs');
  // Set Global API Path Prefix
  app.setGlobalPrefix('/v1');
  
  // Use Custom Logger instead of Default Logger
  app.useLogger(new CanLogger());
  // Add Global Authentication to Every Routes
  // app.useGlobalGuards(new CanAuthGuard());
  // Add Global Role Authorization to Every Routes
  // app.useGlobalGuards(new CanPermissionsGuard());
  // Add Global Filters to Parse the errors
  app.useGlobalFilters(new HttpExceptionFilter());

  
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Set The HTTP Secure Header for vulnerabilities
  app.use(helmet());
  // Get Config Service
  const configService = app.get(ConfigService);
  // Cookie Parser
  app.use(cookieParser(configService.get('COOKIE_PARSER_SECRET')));
  // Initialize Can Context Service
  CanContextService.init(app);
  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('Biotech connects API')
    .setDescription('biotech_connects API description')
    .setVersion('1.0')
    .addTag('biotech_connects')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1', app, document);
  
  // Start App
  await app.listen(parseInt(configService.get('PORT')));
}
