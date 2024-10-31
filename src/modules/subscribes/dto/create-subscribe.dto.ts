import { IsUUID } from "class-validator";

export class CreateSubscribeDto {
    @IsUUID()
    ownerId: string

    @IsUUID()
    userId: string
}