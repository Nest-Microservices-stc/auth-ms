import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class HandleErrorsService {
    private logger = new Logger(HandleErrorsService.name);

    private readonly ErrorsMapping = {
        auth: {
            email: 'The email is already in use',
        },
    };

    private readonly StatusMessages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error',
    };

    public handleError(error: any, context: string) {
        this.logger.error(error);

        if (error.code === 'P2002') {
            const rawTarget = error.meta?.target;
            const field = Array.isArray(rawTarget) ? rawTarget[0] : rawTarget;
            const cleanField = field?.split('_')[0] ?? 'unknown';

            const fieldMessage = this.ErrorsMapping[context]?.[cleanField];

            this.throwRpcException(
                fieldMessage ?? `Duplicate value for field '${cleanField}'`,
                HttpStatus.CONFLICT
            );
        }

        throw new InternalServerErrorException(error.message ?? 'Internal server error');
    }


    public throwRpcException(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR): never {
        const errorType = this.StatusMessages[statusCode] ?? 'Unknown Error';

        throw new RpcException({
            message,
            statusCode,
            error: errorType,
        });
    }

}
