import { IsString, IsUUID } from "class-validator";

export class RefactorMessageDto {
    @IsUUID()
    userId: string

    @IsUUID()
    messageId: string

    @IsString()
    textMessage: string
}

export class RefactorMessageBodyDto {
    @IsString()
    textMessage: string
}