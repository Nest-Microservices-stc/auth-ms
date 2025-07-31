import { Module } from '@nestjs/common';
import { PaginationService } from './services/pagination/pagination.service';
import { PrismaService } from './services/prisma/prisma.service';
import { HandleErrorsService } from './services/rpc/handle-errors.service';
import { GlobalRpcService } from './services/rpc/global-rpc.service';
import { RpcErrorHandlerService } from './services/rpc/rpc-error-handler.service';

@Module({
  providers: [PrismaService, HandleErrorsService, PaginationService, GlobalRpcService, RpcErrorHandlerService],
  exports: [PrismaService, HandleErrorsService, PaginationService, GlobalRpcService],
})
export class CommonModule {}
