import { IsUUID } from "class-validator"

export class GetMembersOfDialogDto {
    @IsUUID()
    userId: string

    @IsUUID()
    dialogId: string
}