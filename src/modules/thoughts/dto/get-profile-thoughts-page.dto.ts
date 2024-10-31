import { IsNumber, IsUUID } from "class-validator";

export class GetProfileThoughtsPageDto {
    @IsUUID()
    userId: string

    @IsNumber()
    pageNumber: number

    @IsNumber()
    pageSize: number
}