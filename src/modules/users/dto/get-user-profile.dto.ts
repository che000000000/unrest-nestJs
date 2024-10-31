import { IsOptional, IsUUID } from "class-validator"

export class GetUserProfileDto {
    @IsUUID()
    userId: string
}