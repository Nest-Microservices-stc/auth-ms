import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './repositories/user.repository';
import { BcryptService, CookieService, JwtService } from './services';
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/config';

@Module({
  imports: [
    NatsModule, CommonModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, JwtService, CookieService, UserRepository],
})
export class AuthModule { }