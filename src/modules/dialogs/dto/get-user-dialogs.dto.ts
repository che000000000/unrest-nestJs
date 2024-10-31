import { IsUUID } from "class-validator";

export class GetUserDialogsDto {
    @IsUUID()
    userId: string
}