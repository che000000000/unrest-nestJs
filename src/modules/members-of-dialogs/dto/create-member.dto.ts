import { IsEnum, IsUUID } from "class-validator"

enum Privilege {
    NONE = "none",
    ADMIN = "admin",
    OWNER = "owner"
}

export class CreateMemberOfDialogDto {
    @IsUUID()
    dialogId: string

    @IsUUID()
    userId: string

    @IsEnum(Privilege)
    privilege: string
}