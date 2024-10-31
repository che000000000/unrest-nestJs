import { IsEmail, IsString } from "class-validator"

export class SignInDto {
    @IsEmail()
    email: string

    @IsString()
    password: string
}

export class SignInBodyDto {
    @IsEmail()
    email: string

    @IsString()
    password: string
}