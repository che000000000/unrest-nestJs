import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'
import { AppError } from 'src/common/errors';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async singIn(dto: SignInDto) {
        const foundUser = await this.usersService.findUserByEmail(dto.email)
        if (!foundUser) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const isMatch = await bcrypt.compare(dto.password, foundUser.password)
        if (!isMatch) throw new BadRequestException(AppError.INCORRECT_PASSWORD)
        const payload = {
            sub: foundUser.id,
            email: foundUser.email,
            userTag: foundUser.userTag,
            name: foundUser.userName
        }
        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: this.configService.get('jwt.expire')
        })
        if (!token) throw new BadRequestException(AppError.AUTHORIZATION_ERROR)
        const responseUser = {
            id: foundUser.id,
            email: foundUser.email,
            userTag: foundUser.userTag,
            userName: foundUser.userName,
            avatar: foundUser.avatar,
            aboutMe: foundUser.aboutMe,
            isWallOpen: foundUser.isWallOpen
        }
        return { token, user: responseUser }
    }

    async signUp(dto: SignUpDto) {
        if (await this.usersService.findUserByEmail(dto.email)) throw new BadRequestException(AppError.EMAIL_IS_TAKEN)
        if (await this.usersService.findUserByUserTag(dto.userTag)) throw new BadRequestException(AppError.USER_TAG_IS_TAKEN)
        const result = await this.usersService.createUser(dto)
        return result
    }

    async verifyAuth(dto) {
        const foundUser = await this.usersService.findUserById(dto.userId)
        if (!foundUser) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const responseUser = {
            id: foundUser.id,
            email: foundUser.email,
            userTag: foundUser.userTag,
            userName: foundUser.userName,
            avatar: foundUser.avatar,
            aboutMe: foundUser.aboutMe,
            isWallOpen: foundUser.isWallOpen
        }
        return responseUser
    }
}