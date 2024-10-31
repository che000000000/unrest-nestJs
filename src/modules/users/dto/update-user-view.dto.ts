import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateUserViewDto {
    @IsUUID()
    userId: string

    toUpdate: UpdateUserViewBodyDto
}

export class UpdateUserViewBodyDto {
    @IsOptional()
    @IsString()
    userName: string

    @IsOptional()
    @IsString()
    avatar: string

    @IsOptional()
    @IsString()
    aboutMe: string
}