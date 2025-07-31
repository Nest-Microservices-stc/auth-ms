import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma/prisma.service';
import { User } from 'generated/prisma';
import { isEmail } from 'class-validator';
import { RegisterUserDto } from '../dto';

@Injectable()
export class UserRepository {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async find(term: User['id'] | User['email'], needPassword = false) {
        return await this.prisma.user.findUnique({
            where: isEmail(term)
                ? { email: term as User['email'] }
                : { id: term as User['id'] },
        });
    }

    async infoUser(id: User['id']) {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
    }

    async create(registerUserDto: RegisterUserDto) {
        const user = await this.prisma.user.create({
            data: {
                name: registerUserDto.name,
                email: registerUserDto.email,
                password: registerUserDto.password
            }
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }

}
