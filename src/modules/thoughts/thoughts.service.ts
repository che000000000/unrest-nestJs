import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Thought } from './model';
import { UsersService } from '../users/users.service';
import { v4 } from 'uuid'
import { createThoughtDto } from './dto/create-thought.dto';
import { AppError } from 'src/common/errors';
import { GetProfileThoughtsPageDto } from './dto/get-profile-thoughts-page.dto';
import { RefactorThoughtDto } from './dto/refactor-thought.dto';
import { DeleteThoughtDto } from './dto/delete-thought.dto';
import { Op } from 'sequelize';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Injectable()
export class ThoughtsService {
    constructor(
        @InjectModel(Thought) private readonly thoughtsRepository: typeof Thought,
        private readonly usersService: UsersService
    ) { }

    async genSubscribeId() {
        while (true) {
            const id = v4()
            const thoughtExists = await this.thoughtsRepository.findOne({ where: { id } })
            if (!thoughtExists) return id
        }
    }

    async formatDate (date: string, dateFormat: string, locale: any) {
        return format(new Date(date), dateFormat, { locale })
    }

    async findThoughtById(thought_id: string) {
        return await this.thoughtsRepository.findOne({ where: { id: thought_id } })
    }

    async createThought(dto: createThoughtDto) {
        const userExists = await this.usersService.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const newThought = await this.thoughtsRepository.create({
            id: await this.genSubscribeId(),
            thoughtText: dto.thoughtText,
            creatorId: dto.creatorId,
            userId: dto.userId
        })
        return {
            id: newThought.id,
            thoughtText: newThought.thoughtText,
            creatorId: newThought.creatorId,
            userId: newThought.userId,
            CreatedAt: newThought.createdAt,
            UpdatedAt: newThought.updatedAt > newThought.createdAt ? newThought.updatedAt : null
        }
    }

    async getProfileThoughtsPage(dto: GetProfileThoughtsPageDto) {
        const userExists = await this.usersService.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const totalThoughtsCount = await this.thoughtsRepository.count({ where: { userId: dto.userId } })
        const profileThoughts = await this.thoughtsRepository.findAll({
            where: { userId: dto.userId },
            limit: dto.pageSize,
            offset: (dto.pageNumber - 1) * dto.pageSize,
            order: [['createdAt', 'DESC']]
        })
        const creatorsUsersIds = [...new Set(profileThoughts.map(thought => thought.creatorId))]
        const creatorsUsers = await this.usersService.findUsersByIds(creatorsUsersIds)
        const profileThoughtsPage = await Promise.all(profileThoughts.flatMap(thought => {
            const creatorUser = creatorsUsers.find(user => user.id === thought.creatorId)
            return {
                id: thought.id,
                creator: {
                    id: creatorUser.id,
                    userTag: creatorUser.userTag,
                    userName: creatorUser.userName,
                    avatar: creatorUser.avatar
                },
                thoughtText: thought.thoughtText,
                userId: thought.userId,
                createdAt: format(new Date(thought.createdAt), 'dd.MM.yy HH:mm', {locale: ru}),
                updatedAt: thought.updatedAt > thought.createdAt ? format(new Date(thought.updatedAt), 'dd.MM.yy HH:mm', {locale: ru}) : null
            }
        }))
        return { profileThoughtsPage, totalThoughtsCount }
    }

    async refactorThought(dto: RefactorThoughtDto) {
        const thoughtExists = await this.findThoughtById(dto.thoughtId)
        if (!thoughtExists) throw new BadRequestException(AppError.THOUGHT_NOT_EXISTS)
        const isUserThoughtOwner = await this.thoughtsRepository.findOne({ where: { id: dto.thoughtId, creatorId: dto.userId } })
        if (!isUserThoughtOwner) throw new BadRequestException(AppError.NOT_ENOUGH_RIGHTS)
        const refactoredStatus = await this.thoughtsRepository.update(dto.toUpdate, { where: { id: dto.thoughtId } })
        if (!refactoredStatus) return { status: 0 }
        return await this.findThoughtById(dto.thoughtId)
    }

    async deleteThought(dto: DeleteThoughtDto) {
        const thoughtExists = await this.thoughtsRepository.findOne({ where: { id: dto.thoughtId } })
        if (!thoughtExists) throw new BadRequestException(AppError.THOUGHT_NOT_EXISTS)
        const hasUserRights = await this.thoughtsRepository.findOne({
            where: {
                [Op.or]: [
                    { id: dto.thoughtId, creatorId: dto.userId },
                    { id: dto.thoughtId, userId: dto.userId }
                ]
            }
        })
        if (!hasUserRights) throw new BadRequestException(AppError.NOT_ENOUGH_RIGHTS)
        return await this.thoughtsRepository.destroy({ where: { id: dto.thoughtId } })
    }
}
