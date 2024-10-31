import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscribe } from './model';
import { UsersService } from '../users/users.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { AppError } from 'src/common/errors';
import { v4 } from 'uuid'
import { GetSubscribesPageDto } from './dto/get-subscribes-page.dto';
import { GetUserSubscribeStatusDto } from './dto/get-subscribe-status.dto';
import { DeleteSubscribeDto } from './dto/delete-subscribe.dto';

@Injectable()
export class SubscribesService {
    constructor(
        @InjectModel(Subscribe) private readonly subscribesRepository: typeof Subscribe,
        private readonly usersService: UsersService
    ) { }

    async genSubscribeId() {
        while (true) {
            const id = v4()
            const userExists = await this.subscribesRepository.findOne({ where: { id } })
            if (!userExists) return id
        }
    }

    async findSubscribeById(subscribe_id: string) {
        return await this.subscribesRepository.findOne({ where: { id: subscribe_id } })
    }

    async createSubscribe(dto: CreateSubscribeDto) {
        const userExists = await this.usersService.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const subscribeExists = await this.subscribesRepository.findOne({ where: { ownerId: dto.ownerId, userId: dto.userId } })
        if (subscribeExists) throw new BadRequestException(AppError.SUBSCRIBE_ALREADY_EXISTS)
        const createdSub = await this.subscribesRepository.create({
            id: await this.genSubscribeId(),
            ownerId: dto.ownerId,
            userId: dto.userId
        })
        if (createdSub) return { id: createdSub.id }
    }

    async deleteSubscribe(dto: DeleteSubscribeDto) {
        const subscribeExists = await this.findSubscribeById(dto.subscribeId)
        if (!subscribeExists) throw new BadRequestException(AppError.SUB_NOT_EXISTS)
        const deleteSubStatus = await this.subscribesRepository.destroy({ where: { id: dto.subscribeId } })
        if (deleteSubStatus) return { deleteSubStatus }
        else return { status: 0 }
    }

    async getSubscribesPage(dto: GetSubscribesPageDto) {
        if (dto.pageSize > 20 || dto.pageSize < 1) throw new BadRequestException(AppError.INVALID_PAGE_SIZE)
        if (dto.pageNumber <= 0) throw new BadRequestException(AppError.INCORRECT_PAGE)
        const userExists = await this.usersService.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const totalSubscribesCount = await this.subscribesRepository.count({ where: { ownerId: dto.userId } })
        const subscribesList = await this.subscribesRepository.findAll({
            where: { ownerId: dto.userId },
            limit: dto.pageSize,
            offset: (dto.pageNumber - 1) * dto.pageSize
        })
        const usersIds = subscribesList.map(subscribe => subscribe.userId)
        const foundUsers = await this.usersService.findUsersByIds(usersIds)
        const subscribesPage = foundUsers.map(user => ({
            id: user.id,
            userTag: user.userTag,
            userName: user.userName,
            avatar: user.avatar
        }))
        return {
            subscribesPage,
            totalSubscribesCount
        }
    }

    async getUserSubscribeStatus(dto: GetUserSubscribeStatusDto) {
        if (dto.senderId === dto.userId) return { status: null }
        const userExists = await this.usersService.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const subscribeExists = await this.subscribesRepository.findOne({ where: { ownerId: dto.senderId, userId: dto.userId } })
        if (subscribeExists) return { id: subscribeExists.id, status: true }
        else return { status: false }
    }
}
