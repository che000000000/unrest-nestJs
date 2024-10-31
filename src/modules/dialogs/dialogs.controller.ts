import { Body, Controller, Delete, Get, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { CreateDialogBodyDto, CreateDialogDto, CreateSingleDialogDto} from './dto/create-dialog.dto';
import { AuthGuard } from '../auth/auth.guard';
import { DeleteDialogDto } from './dto/delete-dialog.dto';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';
import { GetUserDialogsDto } from './dto/get-user-dialogs.dto';

@Controller('dialogs')
export class DialogsController {
    constructor(private readonly dialogsService: DialogsService) { }

    @UseGuards(AuthGuard)
    @Post('create')
    createDialog(@Req() request: AuthReqInterface, @Body() body: CreateDialogBodyDto) {
        const dto: CreateDialogDto = {creatorId: request.user.sub, ...body}
        return this.dialogsService.createDialog(dto)
    }

    @UseGuards(AuthGuard)
    @Get('my-dialogs')
    getUserDialogs(@Req() request: AuthReqInterface) {
        const dto: GetUserDialogsDto = {userId: request.user.sub}
        return this.dialogsService.getUserDialogs(dto)
    }

    @UseGuards(AuthGuard)
    @Delete('delete')
    deleteDialog(@Req() request: AuthReqInterface, @Query('dialog-id', new ParseUUIDPipe()) dialog_id: string) {
        const dto: DeleteDialogDto = {userId: request.user.sub, dialogId: dialog_id}
        return this.dialogsService.deleteDialog(dto)
    }
}