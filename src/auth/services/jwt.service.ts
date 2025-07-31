import { Injectable } from '@nestjs/common';
import { JwtService as JwtServiceInject } from '@nestjs/jwt';
import { JwtPayloadInterface } from '../interfaces/data';
import { JwtPayloadWithUser } from '../interfaces/data/jwt-payload.interfaces';

@Injectable()
export class JwtService {

    constructor(
        private readonly jwtService: JwtServiceInject
    ) { }

    public getJwt(payload: JwtPayloadInterface): string {
        return this.jwtService.sign(payload);
    }

    public decodeJwt(token: string): JwtPayloadWithUser {
        return this.jwtService.verify(token);
    }

    public maybeRenewJwt(token: string): { newToken: string | null, payload: JwtPayloadWithUser } {
        const payload = this.jwtService.verify(token);
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = payload.exp - now;

        let newToken: string | null = null;
        if (timeLeft < 86400) {
            newToken = this.getJwt({ id: payload.id });
        }

        return { newToken, payload };
    }

}
