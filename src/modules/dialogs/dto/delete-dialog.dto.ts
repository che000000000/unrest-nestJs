import { IsString } from "class-validator";

export class DeleteDialogDto {
    @IsString()
    userId: string

    @IsString()
    dialogId: string
}