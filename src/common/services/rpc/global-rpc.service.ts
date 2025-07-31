import { Injectable, Logger } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { RpcErrorHandlerService } from './rpc-error-handler.service';

@Injectable()
export class GlobalRpcService {
  private readonly logger = new Logger(GlobalRpcService.name);

  constructor(private readonly errorHandler: RpcErrorHandlerService) {}

  async execute<T>(obs$: Observable<T>): Promise<T> {
    try {
      const response = await firstValueFrom(obs$);
      this.throwIfResponseIsError(response);
      return response;
    } catch (error) {
      throw this.errorHandler.mapToRpcException(error);
    }
  }

  private throwIfResponseIsError<T>(response: T): void {
    if (
      response &&
      typeof response === 'object' &&
      'statusCode' in response &&
      (response as any)['statusCode'] >= 400
    ) {
      this.logger.warn('[MS Warning]', response);
      throw this.errorHandler.mapToRpcException(response);
    }
  }
}
