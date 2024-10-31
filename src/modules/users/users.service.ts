import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model';
import * as bcrypt from 'bcrypt'
import { AppError } from 'src/common/errors';
import { v4 } from 'uuid';
import { Op } from 'sequelize';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUsersPageDto } from './dto/get-users-page.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { UpdateUserViewDto } from './dto/update-user-view.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly usersRepository: typeof User) { }

    // Служебные методы

    async hashString(string: string) { // Закодировать строку
        return await bcrypt.hash(string, await bcrypt.genSalt())
    }

    async genUserId() {
        while (true) {
            const id = v4()
            const userExists = await this.usersRepository.findOne({ where: { id } })
            if (!userExists) return id
        }
    }

    async findUsersByIds(users_ids: string[]) {
        return await this.usersRepository.findAll({
            where: {
                id: { [Op.in]: users_ids }
            }
        })
    }

    async findUserById(user_id: string) {
        return await this.usersRepository.findOne({ where: { id: user_id } })
    }

    async findUserByEmail(email: string) {
        return await this.usersRepository.findOne({ where: { email } })
    }

    async findUserByUserTag(user_tag: string) {
        return await this.usersRepository.findOne({ where: { userTag: user_tag } })
    }

    async createUser(body: CreateUserDto) {
        const { password, ...userData } = body
        const createdUser = await this.usersRepository.create({
            id: await this.genUserId(),
            ...userData,
            password: await this.hashString(password)
        })
        if (createdUser) return 1
        else return 0
    }

    // Методы API

    async getUserProfile(dto: GetUserProfileDto) {
        const userProfile = await this.usersRepository.findOne({
            attributes: ['id', 'email', 'userTag', 'userName', 'avatar', 'aboutMe', 'isWallOpen'],
            where: { id: dto.userId }
        })
        if (!userProfile) throw new BadRequestException(AppError.USER_NOT_EXIST)
        return userProfile
    }

    async getUsersPage(dto: GetUsersPageDto) {
        if (dto.pageSize > 20 || dto.pageSize < 1) throw new BadRequestException(AppError.INVALID_PAGE_SIZE)
        if (dto.pageNumber <= 0) throw new BadRequestException(AppError.INCORRECT_PAGE)
        const totalUsersCount = await this.usersRepository.count()
        const usersPage = await this.usersRepository.findAll({
            attributes: ['id', 'email', 'userTag', 'userName', 'avatar', 'aboutMe', 'isWallOpen'],
            limit: dto.pageSize,
            offset: (dto.pageNumber - 1) * dto.pageSize
        })
        return {
            usersPage,
            totalUsersCount
        }
    }

    async updateUserView(dto: UpdateUserViewDto) {
        const userExists = await this.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const refactoredUserView = await this.usersRepository.update(dto.toUpdate, {where: { id: dto.userId }})
        if (!refactoredUserView) return { status: 0 }
        const updatedUser = await this.findUserById(dto.userId)
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            userTag: updatedUser.userTag,
            userName: updatedUser.userName,
            avatar: updatedUser.avatar,
            aboutMe: updatedUser.aboutMe,
            isWallOpen: updatedUser.isWallOpen,
        }
    }

    async deleteUser(dto: DeleteUserDto) {
        if (await this.findUserById(dto.userId)) return await this.usersRepository.destroy({ where: { id: dto.userId } })
        else throw new BadRequestException(AppError.USER_NOT_EXIST)
    }
}