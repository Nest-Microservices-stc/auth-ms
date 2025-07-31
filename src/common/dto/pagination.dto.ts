import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn([5, 10, 15])
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number;
}
