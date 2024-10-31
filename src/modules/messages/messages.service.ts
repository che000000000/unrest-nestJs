import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './model';
import { MembersOfDialogsService } from '../members-of-dialogs/members-of-dialogs.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { AppError } from 'src/common/errors';
import { v4 } from 'uuid'
import { SendMessageDto } from './dto/send-message.dto';
import { UsersService } from '../users/users.service';
import { RefactorMessageDto } from './dto/refactor-message.dto';
import { GetDialogMessagesDto } from './dto/get-dialog-messages.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message) private readonly messagesRepository: typeof Message,
        private readonly membersOfDialogsService: MembersOfDialogsService,
        private readonly dialogsService: DialogsService,
        private readonly usersService: UsersService
    ) { }

    async findMessageById(message_id: string) {
        return await this.messagesRepository.findOne({ where: { id: message_id } })
    }

    async findMessageByIdInDialog(message_id: string, dialog_id: string) {
        return await this.messagesRepository.findOne({ where: { id: message_id, dialogId: dialog_id } })
    }

    async genMessageId() {
        while (true) {
            const generatedId = v4()
            const existingMessage = await this.messagesRepository.findOne({ where: { id: generatedId } })
            if (!existingMessage) return generatedId
        }
    }

    async permissionToOperateOnMessage(message_id: string, user_id: string) {
        const messageExists = await this.findMessageById(message_id)
        if (!messageExists) throw new BadRequestException(AppError.MESSAGE_NOT_EXISTS)
        const memberExists = await this.membersOfDialogsService.findMemberByUserId(messageExists.dialogId, user_id)
        if (!memberExists) throw new BadRequestException(AppError.YOU_ARE_NOT_IN_DIALOG)
        if (messageExists.userId !== user_id) throw new BadRequestException(AppError.NOT_YOUR_MESSAGE)
        return true
    }

    async accessToDialog(dialog_id: string, user_id: string) {
        const dialogExists = await this.dialogsService.findDialogById(dialog_id)
        if (!dialogExists) throw new BadRequestException(AppError.DIALOG_NOT_EXIST)
        const memberExists = await this.membersOfDialogsService.findMemberByUserId(dialog_id, user_id)
        if (!memberExists) throw new BadRequestException(AppError.YOU_ARE_NOT_IN_DIALOG)
        return true
    }

    async sendMessage(dto: SendMessageDto) {
        await this.accessToDialog(dto.dialogId, dto.userId)
        const senderUser = await this.usersService.findUserById(dto.userId)
        if (!senderUser) throw new BadRequestException(AppError.USER_NOT_EXIST)
        const newMessage = await this.messagesRepository.create({
            id: await this.genMessageId(),
            textMessage: dto.textMessage,
            dialogId: dto.dialogId,
            userId: dto.userId
        })
        return {
            id: newMessage.id,
            userId: newMessage.userId,
            userTag: senderUser.userTag,
            userName: senderUser.userName,
            userAvatar: senderUser.avatar,
            textMessage: newMessage.textMessage,
            sendedAt: newMessage.createdAt,
        }
    }

    async getDialogMessages(dto: GetDialogMessagesDto) {
        const membersAsUsersList = await this.membersOfDialogsService.getMembersOfDialog({ userId: dto.userId, dialogId: dto.dialogId })
        const messagesList = await this.messagesRepository.findAll({
            limit: dto.pageSize,
            offset: (dto.pageNumber - 1) * dto.pageSize,
            order: [['createdAt', 'DESC']],
            where: { dialogId: dto.dialogId }
        })
        const messagesPage = messagesList.map(message => {
            const senderUser = membersAsUsersList.find(member => member.userId === message.userId)
            return {
                id: message.id,
                sender: {
                    id: message.userId,
                    userName: senderUser.userName,
                    userTag: senderUser.userTag,
                    userAvatar: senderUser.userAvatar,
                },
                textMessage: message.textMessage,
                createdAt: format(new Date(message.createdAt), 'dd.MM.yy HH:mm', { locale: ru }),
                updatedAt: message.updatedAt > message.createdAt ? format(new Date(message.updatedAt), 'dd.MM.yy HH:mm', { locale: ru }) : null
            }
        })
        const totalMessagesCount = await this.messagesRepository.count({ where: { dialogId: dto.dialogId } })
        return { massagesPage: messagesPage, totalMessagesCount }
    }

    async refactorMessage(dto: RefactorMessageDto) {
        await this.permissionToOperateOnMessage(dto.messageId, dto.userId)
        const senderUser = await this.usersService.findUserById(dto.userId)
        if (!senderUser) throw new BadRequestException(AppError.USER_NOT_EXIST)
        await this.messagesRepository.update(dto, { where: { id: dto.messageId, userId: dto.userId } })
        const refactoredMessage = await this.findMessageById(dto.messageId)
        return {
            id: refactoredMessage.id,
            userId: refactoredMessage.userId,
            userTag: senderUser.userTag,
            userName: senderUser.userName,
            userAvatar: senderUser.avatar,
            textMessage: refactoredMessage.textMessage,
            sendedAt: refactoredMessage.createdAt,
            updatedAt: refactoredMessage.updatedAt
        }
    }

    async deleteMessage(dto: DeleteMessageDto) {
        await this.permissionToOperateOnMessage(dto.messageId, dto.userId)
        return await this.messagesRepository.destroy({ where: { id: dto.messageId, userId: dto.userId } })
    }
}