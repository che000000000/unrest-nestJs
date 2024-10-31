import { IsString, IsUUID } from "class-validator";

export class createThoughtDto {
    @IsString()
    thoughtText: string

    @IsUUID()
    creatorId: string

    @IsUUID()
    userId: string
}