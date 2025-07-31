import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [AuthModule, CommonModule, NatsModule],
})
export class AppModule {}
