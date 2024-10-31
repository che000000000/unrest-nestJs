import { IsUUID } from "class-validator";

export class GetUserSubscribeStatusDto {
    @IsUUID()
    senderId: string

    @IsUUID()
    userId: string
}