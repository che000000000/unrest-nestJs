import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Dialog } from './model';
import { InjectModel } from '@nestjs/sequelize';
import { v4 } from 'uuid'
import { UsersService } from '../users/users.service';
import { CreateDialogDto, CreateSingleDialogDto } from './dto/create-dialog.dto';
import { AppError } from 'src/common/errors';
import { MembersOfDialogsService } from '../members-of-dialogs/members-of-dialogs.service';
import { Op } from 'sequelize';
import { GetUserDialogsDto } from './dto/get-user-dialogs.dto';
import { DeleteDialogDto } from './dto/delete-dialog.dto';

@Injectable()
export class DialogsService {
    constructor(
        @InjectModel(Dialog) private readonly dialogsRepository: typeof Dialog,
        @Inject(forwardRef(() => MembersOfDialogsService)) private readonly membersOfDialogsService: MembersOfDialogsService,
        private readonly usersService: UsersService
    ) { }


    async generateDialogId() {
        while (true) {
            const generatedId = v4()
            const existingDialog = await this.dialogsRepository.findOne({ where: { id: generatedId } })
            if (!existingDialog) return generatedId
        }
    }

    async findDialogType(dialog_id: string) {
        const dialog = await this.dialogsRepository.findOne({ where: { id: dialog_id } })
        return dialog.isPrivate
    }

    async findDialogById(dialog_id: string) {
        return await this.dialogsRepository.findOne({ where: { id: dialog_id } })
    }

    async getDialogPrivateStatus(dialog_id: string) {
        const dialogData = await this.dialogsRepository.findOne({ where: { id: dialog_id } })
        return dialogData.isPrivate
    }

    async newDialog(dialog_name: string, dialog_avatar: string, is_private: boolean) {
        const newDialog = await this.dialogsRepository.create({
            id: await this.generateDialogId(),
            dialogName: dialog_name,
            dialogAvatar: dialog_avatar,
            isPrivate: is_private
        })
        return newDialog
    }

    async createSingleDialog(dto: CreateSingleDialogDto) {
        if (!await this.usersService.findUserById(dto.creatorId)) throw new BadRequestException(AppError.USER_NOT_EXIST)
        if (dto.isPrivate) throw new BadRequestException(AppError.PRIVATE_DIALOG_MEMBER_COUNT)
        const newDialog = await this.newDialog(dto.dialogName, dto.dialogAvatar, dto.isPrivate);
        await this.membersOfDialogsService.createDialogMember({
            dialogId: newDialog.id,
            userId: dto.creatorId,
            privilege: 'owner'
        })
        return {
            id: newDialog.id,
            dialogName: newDialog.dialogName,
            dialogAvatar: newDialog.dialogAvatar,
            isPrivate: newDialog.isPrivate
        }
    }

    async createDialog(dto: CreateDialogDto) {
        if (!dto.usersIds) {
            return await this.createSingleDialog({
                creatorId: dto.creatorId,
                dialogName: dto.dialogName,
                dialogAvatar: dto.dialogAvatar,
                isPrivate: dto.isPrivate
            })
        } 
        if (dto.usersIds.includes(dto.creatorId)) throw new BadRequestException(AppError.TRYING_ADD_TO_DIALOG_YOURSELF)
        const foundUsers = await this.usersService.findUsersByIds([dto.creatorId, ...dto.usersIds]);
        if (foundUsers.length !== dto.usersIds.length + 1) throw new BadRequestException(AppError.USER_NOT_EXIST)
        if (dto.isPrivate && dto.usersIds.length + 1 !== 2) throw new BadRequestException(AppError.PRIVATE_DIALOG_MEMBER_COUNT)
        const newDialog = await this.newDialog(dto.dialogName, dto.dialogAvatar, dto.isPrivate)
        for (const user of foundUsers) {
            const privilege = (user.id === dto.creatorId) ? 'owner' : (dto.isPrivate ? 'none' : 'none');
            await this.membersOfDialogsService.createDialogMember({
                dialogId: newDialog.id,
                userId: user.id,
                privilege
            })
        }
        if (!dto.isPrivate && !dto.dialogName) throw new BadRequestException(AppError.NAME_OF_GROUP_DIALOG)
        return {
            id: newDialog.id,
            dialogName: newDialog.dialogName,
            dialogAvatar: newDialog.dialogAvatar,
            isPrivate: newDialog.isPrivate
        }
    }

    async getUserDialogs(dto: GetUserDialogsDto) {
        const userExists = await this.usersService.findUserById(dto.userId)
        if (!userExists) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const userAsMembers = await this.membersOfDialogsService.findAllMembersWhereUserId(dto.userId)
        const dialogIds = userAsMembers.map(member => member.dialogId);
        const userDialogs = await this.dialogsRepository.findAll({
            attributes: ['id', 'dialogName', 'dialogAvatar', 'isPrivate'],
            where: {
                id: { [Op.in]: dialogIds }
            }
        })
        return userDialogs
    }

    async deleteDialog(dto: DeleteDialogDto) {
        if (!await this.findDialogById(dto.dialogId)) throw new BadRequestException(AppError.DIALOG_NOT_EXIST)
        if (!await this.usersService.findUserById(dto.userId)) throw new BadRequestException(AppError.USER_NOT_EXIST)
        if (!await this.membersOfDialogsService.findMemberByUserId(dto.dialogId, dto.userId)) throw new BadRequestException(AppError.YOU_ARE_NOT_IN_DIALOG)
        const memberOfDialogPrivilege = await this.membersOfDialogsService.getMemberPrivilegeByUserId(dto.dialogId, dto.userId)
        if (memberOfDialogPrivilege !== 'owner') throw new BadRequestException(AppError.SUFFICIENT_RIGHTS)
        return await this.dialogsRepository.destroy({ where: { id: dto.dialogId } })
    }
}