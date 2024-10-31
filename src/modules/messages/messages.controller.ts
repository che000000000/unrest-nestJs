import { Body, Controller, Delete, Get, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';
import { SendMessageBodyDto, SendMessageDto } from './dto/send-message.dto';
import { RefactorMessageBodyDto, RefactorMessageDto } from './dto/refactor-message.dto';
import { GetDialogMessagesDto } from './dto/get-dialog-messages.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @UseGuards(AuthGuard)
    @Post('send')
    sendMessage(@Req() request: AuthReqInterface, @Query('dialog-id', new ParseUUIDPipe()) dialog_id, @Body() body: SendMessageBodyDto) {
        const dto: SendMessageDto = { userId: request.user.sub, dialogId: dialog_id, ...body }
        return this.messagesService.sendMessage(dto)
    }

    @UseGuards(AuthGuard)
    @Get('get-page')
    getMessagesPage(
        @Req() request: AuthReqInterface,
        @Query('dialog-id', new ParseUUIDPipe()) dialog_id,
        @Query('page', new ParseIntPipe()) page_number,
        @Query('size', new ParseIntPipe()) page_size
    ) {
        const dto: GetDialogMessagesDto = {
            userId: request.user.sub,
            dialogId: dialog_id,
            pageNumber: page_number,
            pageSize: page_size
        }
        return this.messagesService.getDialogMessages(dto)
    }

    @UseGuards(AuthGuard)
    @Patch('refactor')
    refactorMessage(
        @Req() request: AuthReqInterface,
        @Query('message-id', new ParseUUIDPipe()) message_id,
        @Body() body: RefactorMessageBodyDto
    ) {
        const dto: RefactorMessageDto = { userId: request.user.sub, messageId: message_id, ...body }
        return this.messagesService.refactorMessage(dto)
    }

    @UseGuards(AuthGuard)
    @Delete('delete')
    deleteMessage(@Req() request: AuthReqInterface, @Query('message-id', new ParseUUIDPipe()) message_id) {
        const dto: DeleteMessageDto = {userId: request.user.sub, messageId: message_id}
        return this.messagesService.deleteMessage(dto)
    }
}