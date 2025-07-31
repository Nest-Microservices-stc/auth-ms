import { Catch, ArgumentsHost, ExceptionFilter, Logger, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError();
    return this.buildErrorResponse(error);
  }

  private buildErrorResponse(error: any) {
    if (typeof error === 'object' && error !== null) {
      const statusCode = error.statusCode || HttpStatus.BAD_REQUEST;
      const message = error.message || 'Bad Request';

      this.logWarn(statusCode, message, error);

      return { statusCode, message, ...error };
    }

    this.logError(String(error));

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: String(error),
    };
  }

  private logWarn(statusCode: number, message: string, error: any) {
    this.logger.warn(`[MS RpcException]: ${statusCode} - ${message}`, error);
  }

  private logError(message: string) {
    this.logger.error(`[MS RpcException]: ${message}`);
  }
}