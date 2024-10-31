import { IsNumber } from "class-validator"

export class GetUsersPageDto {
    @IsNumber()
    pageNumber: number

    @IsNumber()
    pageSize: number
}