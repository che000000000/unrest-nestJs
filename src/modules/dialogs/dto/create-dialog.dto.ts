import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateDialogDto {
    @IsString()
    creatorId: string

    @IsOptional()
    @IsString()
    dialogName: string

    @IsOptional()
    @IsString()
    dialogAvatar: string

    @IsBoolean()
    isPrivate: boolean

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    usersIds: string[]
}

export class CreateSingleDialogDto {
    @IsString()
    creatorId: string

    @IsOptional()
    @IsString()
    dialogName: string

    @IsOptional()
    @IsString()
    dialogAvatar: string

    @IsBoolean()
    isPrivate: boolean
}

export class CreateDialogBodyDto {
    @IsOptional()
    @IsString()
    dialogName: string

    @IsOptional()
    @IsString()
    dialogAvatar: string

    @IsBoolean()
    isPrivate: boolean

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    usersIds: string[]
}