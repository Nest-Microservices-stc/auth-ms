import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    private readonly salt = 10

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
