import { IsUUID } from "class-validator";

export class DeleteSubscribeDto {
    @IsUUID()
    subscribeId: string
}