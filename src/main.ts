import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ParseTrimStringPipe } from './common/pipes/parse-trim-string.pipe';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';

async function bootstrap() {
  const logger = new Logger('Auth-MS');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  );

  app.useGlobalPipes(
    new ParseTrimStringPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  await app.listen();
  logger.log(`Microservice is running on port ${envs.port}`);
}
bootstrap();
