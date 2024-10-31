import { IsArray, IsUUID } from "class-validator";

export class AddMembersToDialogDto {
    @IsUUID()
    userId: string

    @IsUUID()
    dialogId: string;

    @IsArray()
    @IsUUID("all", { each: true })
    usersIds: string[];
}

export class AddMembersToDialogBodyDto {
    @IsArray()
    @IsUUID("all", { each: true })
    usersIds: string[];
}