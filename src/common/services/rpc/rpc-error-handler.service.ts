import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RpcErrorHandlerService {

    private readonly logger = new Logger(RpcErrorHandlerService.name);

    private readonly StatusMessages = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error',
    };

    public mapToRpcException(error: any): RpcException {
        const extracted = this.unwrapError(error);
        const message = this.extractMessage(extracted?.message);

        if (
            typeof extracted === 'object' &&
            'statusCode' in extracted &&
            'message' in extracted &&
            'error' in extracted
        ) {
            return new RpcException({ ...extracted, message });
        }

        if (
            typeof extracted === 'object' &&
            'statusCode' in extracted &&
            'message' in extracted
        ) {
            return new RpcException({
                ...extracted,
                message,
                error: this.StatusMessages[extracted.statusCode] ?? 'Error',
            });
        }

        return new RpcException({
            statusCode: 500,
            message,
            error: 'Internal Server Error',
        });
    }

    private unwrapError(error: any): any {
        let current = error;
        while (current?.error && typeof current.error === 'object') {
            current = current.error;
        }

        if (typeof current === 'object' && 'message' in current) return current;

        if (typeof current === 'string') return { message: current, statusCode: 500 };

        return { message: 'Unexpected error structure', statusCode: 500 };
    }

    private extractMessage(raw: unknown): string | string[] {
        if (Array.isArray(raw)) return raw;

        if (typeof raw !== 'string') return 'Internal server error';

        if (raw.includes(';;;')) {
            return raw
                .split(';;;')
                .map((m) => m.trim())
                .filter((m) => m);
        }

        return raw.includes('(') ? raw.substring(0, raw.indexOf('(')).trim() : raw;
    }
}
