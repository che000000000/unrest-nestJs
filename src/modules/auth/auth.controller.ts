import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInBodyDto, SignInDto } from './dto/sign-in.dto';
import { SignUpBodyDto, SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('sign-in')
    async signIn(@Body() body: SignInBodyDto, @Res({ passthrough: true }) response: Response) {
        const dto: SignInDto = { ...body }
        const signIn = await this.authService.singIn(dto)
        response.cookie('jwt', signIn.token, { httpOnly: true })
        return signIn.user
    }

    @Post('sign-up')
    sighUp(@Body() body: SignUpBodyDto) {
        const dto: SignUpDto = { ...body }
        return this.authService.signUp(dto)
    }

    @UseGuards(AuthGuard)
    @Get('verify')
    async verifyAuth(@Req() request: AuthReqInterface) {
        const foundUser = await this.authService.verifyAuth({ userId: request.user.sub })
        return foundUser
    }

    @UseGuards(AuthGuard)
    @Post('sign-out')
    async signOut(@Res({ passthrough: true }) response: Response) {
        response.cookie('jwt', '', { httpOnly: true })
        return { message: 'Successfully signed out' }
    }
}