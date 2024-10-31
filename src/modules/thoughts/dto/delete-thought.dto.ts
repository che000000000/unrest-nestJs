import { IsUUID } from "class-validator";

export class DeleteThoughtDto {
    @IsUUID()
    userId: string

    @IsUUID()
    thoughtId: string
}