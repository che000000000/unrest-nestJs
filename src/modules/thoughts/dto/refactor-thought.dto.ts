import { IsString, IsUUID } from "class-validator";

export class RefactorThoughtDto {
    @IsUUID()
    userId: string

    @IsUUID()
    thoughtId: string

    toUpdate: RefactorThoughtBodyDto
}

export class RefactorThoughtBodyDto {
    @IsString()
    thoughtText: string
}