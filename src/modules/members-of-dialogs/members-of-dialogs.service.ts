import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MemberOfDialog } from './model';
import { AppError } from 'src/common/errors';
import { DialogsService } from '../dialogs/dialogs.service';
import { v4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { CreateMemberOfDialogDto } from './dto/create-member.dto';
import { AddMembersToDialogDto } from './dto/add-members-to-dialog.dto';
import { GetMembersOfDialogDto } from './dto/get-members-of-dialog.dto';

@Injectable()
export class MembersOfDialogsService {
    constructor(
        @InjectModel(MemberOfDialog) private readonly membersOfDialogsRepository: typeof MemberOfDialog,
        @Inject(forwardRef(() => DialogsService)) private readonly dialogsService: DialogsService,
        private readonly usersService: UsersService
    ) { }

    // Служебные методы

    async genMemberId() {
        while (true) {
            const generatedId = v4()
            const existingDialog = await this.membersOfDialogsRepository.findOne({ where: { id: generatedId } })
            if (!existingDialog) return generatedId
        }
    }

    async findMemberOfDialog(member_id: string) {
        return await this.membersOfDialogsRepository.findOne({ where: { id: member_id } })
    }

    async findMemberByUserId(dialog_id: string, user_id: string) {
        return await this.membersOfDialogsRepository.findOne({ where: { dialogId: dialog_id, userId: user_id } })
    }

    async findMembersOfDialog(dialog_id: string) {
        return await this.membersOfDialogsRepository.findAll({ where: { dialogId: dialog_id } })
    }

    async findAllMembersWhereUserId(user_id: string) {
        return await this.membersOfDialogsRepository.findAll({ where: { userId: user_id } })
    }

    async getMemberPrivilegeByUserId(dialog_id: string, user_id: string): Promise<any> {
        const foundMember = await this.membersOfDialogsRepository.findOne({ where: { userId: user_id, dialogId: dialog_id } })
        return foundMember.privilege
    }

    async createDialogMember(dto: CreateMemberOfDialogDto) {
        const newMember = await this.membersOfDialogsRepository.create({
            id: await this.genMemberId(),
            dialogId: dto.dialogId,
            userId: dto.userId,
            privilege: dto.privilege,
        })
        return await this.membersOfDialogsRepository.findOne({ where: { id: newMember.id } })
    }

    // Методы API

    async addMembersToDialog(dto: AddMembersToDialogDto): Promise<any> {
        if (!await this.dialogsService.findDialogById(dto.dialogId)) throw new BadRequestException(AppError.DIALOG_NOT_EXIST)
        if ((await this.dialogsService.getDialogPrivateStatus(dto.dialogId) === true)) throw new BadRequestException(AppError.ADD_MEMBERS_TO_PRIVATE_DIALOG)
        const memberExists = await this.findMemberByUserId(dto.dialogId, dto.userId)
        if (!memberExists) throw new BadRequestException(AppError.MEMBER_NOT_EXIST)
        const memberPrivilege = await this.getMemberPrivilegeByUserId(dto.dialogId, dto.userId)
        if (memberPrivilege !== 'admin' && memberPrivilege !== 'owner') throw new BadRequestException(AppError.SUFFICIENT_RIGHTS)
        const existingUsers = await this.usersService.findUsersByIds(dto.usersIds)
        if (existingUsers.length !== dto.usersIds.length) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const existingMembers = await this.membersOfDialogsRepository.findAll({ where: { dialogId: dto.dialogId } })
        const existingMembersIds = existingMembers.map(member => member.userId)
        const usersToAdd = existingUsers.filter(user => !existingMembersIds.includes(user.id))
        const addMembersPromises = usersToAdd.map(user =>
            this.createDialogMember({ dialogId: dto.dialogId, userId: user.id, privilege: 'none' })
        )
        const addedMembers = await Promise.all(addMembersPromises)
        if (addedMembers.length === 0) throw new BadRequestException(AppError.ALL_USERS_ALREADY_IN_DIALOG)
        const foundUsers = await this.usersService.findUsersByIds(addedMembers.map(member => member.userId))
        return foundUsers.map(user => ({
            id: user.id,
            email: user.email,
            userTag: user.userTag,
            userName: user.userName,
            avatar: user.avatar
        }))
    }

    async getMembersOfDialog(dto: GetMembersOfDialogDto): Promise<any> {
        if (!await this.dialogsService.findDialogById(dto.dialogId)) throw new BadRequestException(AppError.DIALOG_NOT_EXIST)
        const membersOfDialog = await this.findMembersOfDialog(dto.dialogId)
        const usersIds = membersOfDialog.map(member => member.userId)
        if (!usersIds.find(userId => userId === dto.userId)) throw new BadRequestException(AppError.YOU_ARE_NOT_IN_DIALOG)
        const foundUsers = await this.usersService.findUsersByIds(usersIds)
        if (membersOfDialog.length !== foundUsers.length) throw new BadRequestException(AppError.CANT_GET_MEMBERS_OF_DIALOG)
        const membersAsUsers = foundUsers.map(user => {
            const member = membersOfDialog.find(member => member.userId === user.id)
            return {
                id: member.id,
                userId: user.id,
                userName: user.userName,
                userTag: user.userTag,
                userAvatar: user.avatar,
                privilege: member.privilege
            }
        })
        return membersAsUsers
    }
}