import { BadRequestException, Body, Controller, Delete, Get, ParseIntPipe, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SubscribesService } from './subscribes.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { AppError } from 'src/common/errors';
import { GetSubscribesPageDto } from './dto/get-subscribes-page.dto';
import { GetUserSubscribeStatusDto } from './dto/get-subscribe-status.dto';
import { DeleteSubscribeDto } from './dto/delete-subscribe.dto';

@Controller('subscribes')
export class SubscribesController {
    constructor(private readonly subscribesService: SubscribesService) { }

    @UseGuards(AuthGuard)
    @Post('create')
    async createSubscribe(@Req() request: AuthReqInterface, @Query('user-id', new ParseUUIDPipe()) user_id: string) {
        const dto: CreateSubscribeDto = { ownerId: request.user.sub, userId: user_id }
        const newSubscribe = await this.subscribesService.createSubscribe(dto)
        if (newSubscribe) return newSubscribe
        else return { status: 0 }
    }

    @UseGuards(AuthGuard)
    @Delete('delete')
    async unsubscribe(@Query('sub-id', new ParseUUIDPipe()) subscribe_id: string) {
        const dto: DeleteSubscribeDto = { subscribeId: subscribe_id }
        const deleteSubStatus = await this.subscribesService.deleteSubscribe(dto)
        if (deleteSubStatus) return { status: 1 }
        else return { status: 0 }
    }

    @UseGuards(AuthGuard)
    @Get('page')
    async getUserSubscribesPage(
        @Query('user-id', new ParseUUIDPipe()) user_id: string,
        @Query('page', new ParseIntPipe()) page_number: number,
        @Query('size', new ParseIntPipe()) page_size: number) {
        const dto: GetSubscribesPageDto = { userId: user_id, pageNumber: page_number, pageSize: page_size }
        const subscribesPage = await this.subscribesService.getSubscribesPage(dto)
        if (subscribesPage) return subscribesPage
        else throw new BadRequestException(AppError.CANT_GET_SUBSCRIBES)
    }

    @UseGuards(AuthGuard)
    @Get('status')
    async getUserSubscribeStatus(@Req() request: AuthReqInterface, @Query('user-id', new ParseUUIDPipe()) user_id: string) {
        const dto: GetUserSubscribeStatusDto = {senderId: request.user.sub, userId: user_id}
        const subscribeStatus = await this.subscribesService.getUserSubscribeStatus(dto)
        if (subscribeStatus) return subscribeStatus
        else throw new BadRequestException(AppError.CANT_GET_SUB_STATUS)
    }
}