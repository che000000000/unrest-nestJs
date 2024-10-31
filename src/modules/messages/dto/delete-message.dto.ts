import { IsUUID } from "class-validator";

export class DeleteMessageDto {
    @IsUUID()
    userId: string

    @IsUUID()
    messageId: string
}