import { Body, Controller, Get, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MembersOfDialogsService } from './members-of-dialogs.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';
import { AddMembersToDialogBodyDto, AddMembersToDialogDto } from './dto/add-members-to-dialog.dto';
import { GetMembersOfDialogDto } from './dto/get-members-of-dialog.dto';

@Controller('dialogs-members')
export class MembersOfDialogsController {
    constructor(private readonly membersOfDialogsService: MembersOfDialogsService) { }

    @UseGuards(AuthGuard)
    @Post('add')
    addMembersToDialog(@Req() request: AuthReqInterface, @Query('dialog-id', new ParseUUIDPipe()) dialog_id: string, @Body() body: AddMembersToDialogBodyDto) {
        const dto: AddMembersToDialogDto = {userId: request.user.sub, dialogId: dialog_id, ...body}
        return this.membersOfDialogsService.addMembersToDialog(dto)
    }

    @UseGuards(AuthGuard)
    @Get('dialog')
    getMembersOfDialog(@Req() request: AuthReqInterface, @Query('dialog-id', new ParseUUIDPipe()) dialog_id: string) {
        const dto: GetMembersOfDialogDto = {userId: request.user.sub, dialogId: dialog_id}
        return this.membersOfDialogsService.getMembersOfDialog(dto)
    }
}