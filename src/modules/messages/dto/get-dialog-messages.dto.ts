import { IsNumber, IsUUID } from "class-validator";

export class GetDialogMessagesDto {
    @IsUUID()
    userId: string

    @IsUUID()
    dialogId: string

    @IsNumber()
    pageNumber: number

    @IsNumber()
    pageSize: number
}