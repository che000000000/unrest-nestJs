import { IsNumber, IsUUID } from "class-validator";

export class GetSubscribesPageDto {
    @IsUUID()
    userId: string

    @IsNumber()
    pageNumber: number

    @IsNumber()
    pageSize: number
}