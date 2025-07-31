import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
    getPagination(page: number = 1, limit: number = 10) {
        const take = limit;
        const skip = (page - 1) * limit;
        return { skip, take };
    }

    buildMeta(totalItems: number, skip: number, take: number) {
        return {
            totalItems,
            itemCount: Math.min(take, totalItems - skip),
            itemsPerPage: take,
            totalPages: Math.ceil(totalItems / take),
            currentPage: Math.floor(skip / take) + 1,
            hasNextPage: skip + take < totalItems,
            hasPreviousPage: skip > 0,
        };
    }
}
