import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private logger = new Logger('PrismaService');
    
    async onModuleInit() {
        await this.$connect();
        this.logger.log('✅ Prisma conectado');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('✅ Prisma desconectado');
    }
}