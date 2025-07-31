import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { JwtPayloadInterface } from '../interfaces/data';
import { envs } from 'src/config';
import { HandleErrorsService } from 'src/common/services/rpc/handle-errors.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly globalErrors: HandleErrorsService
  ) {
    super({
      secretOrKey: envs.jwtSecret,
      jwtFromRequest:
        envs.jwtSource === 'COOKIE'
          ? ExtractJwt.fromExtractors([
              (req) => req?.cookies?.token || null,
            ])
          : ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.id }, select: {
      id: true,
      name: true,
      email: true
    } });
    if (!user) this.globalErrors.throwRpcException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }
}