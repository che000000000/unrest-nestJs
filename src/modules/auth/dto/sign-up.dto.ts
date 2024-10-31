import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator"

export class SignUpDto {
    @IsEmail()
    email: string

    @IsString()
    userTag: string

    @IsString()
    userName: string

    @IsString()
    @IsOptional()
    avatar: string | null

    @IsOptional()
    @IsString()
    aboutMe: string | null
 
    @IsOptional()
    @IsBoolean()
    isWallOpen: boolean

    @IsString()
    password: string
}

export class SignUpBodyDto {
    @IsEmail()
    email: string

    @IsString()
    userTag: string

    @IsString()
    userName: string

    @IsString()
    @IsOptional()
    avatar: string | null

    @IsOptional()
    @IsString()
    aboutMe: string | null
 
    @IsOptional()
    @IsBoolean()
    isWallOpen: boolean

    @IsString()
    password: string
}