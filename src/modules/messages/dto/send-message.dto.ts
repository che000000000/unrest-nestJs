import { IsString, IsUUID } from "class-validator";

export class SendMessageDto {
    @IsUUID()
    userId: string

    @IsUUID()
    dialogId: string

    @IsString()
    textMessage: string
}

export class SendMessageBodyDto {
    @IsString()
    textMessage: string
}