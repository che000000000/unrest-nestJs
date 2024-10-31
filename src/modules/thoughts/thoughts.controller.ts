import { Body, Controller, Delete, Get, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';
import { ThoughtsService } from './thoughts.service';
import { createThoughtDto } from './dto/create-thought.dto';
import { GetProfileThoughtsPageDto } from './dto/get-profile-thoughts-page.dto';
import { RefactorThoughtBodyDto, RefactorThoughtDto } from './dto/refactor-thought.dto';
import { DeleteThoughtDto } from './dto/delete-thought.dto';

@Controller('thoughts')
export class ThoughtsController {
    constructor(private readonly thoughtService: ThoughtsService) { }

    @UseGuards(AuthGuard)
    @Post('create')
    async createThought(@Req() request: AuthReqInterface, @Query('user-id', new ParseUUIDPipe()) user_id: string, @Body() body) {
        const dto: createThoughtDto = { creatorId: request.user.sub, thoughtText: body.thoughtText, userId: user_id }
        const newThought = await this.thoughtService.createThought(dto)
        if (newThought) return newThought
        else return { status: 0 }
    }

    @UseGuards(AuthGuard)
    @Get('page')
    async getProfileThoughtsPage(
        @Query('user-id', new ParseUUIDPipe()) user_id: string,
        @Query('page', new ParseIntPipe()) page_number: number,
        @Query('size', new ParseIntPipe()) page_size: number
    ) {
        const dto: GetProfileThoughtsPageDto = { userId: user_id, pageNumber: page_number, pageSize: page_size }
        const thoughtsPage = await this.thoughtService.getProfileThoughtsPage(dto)
        if (thoughtsPage) return thoughtsPage
        else return { status: 0 }
    }

    @UseGuards(AuthGuard)
    @Patch('refactor')
    async refactorThought(
        @Req() request: AuthReqInterface,
        @Query('thought-id', new ParseUUIDPipe()) thought_id: string,
        @Body() body: RefactorThoughtBodyDto
    ) {
        const dto: RefactorThoughtDto = { userId: request.user.sub, thoughtId: thought_id, toUpdate: body }
        const refactoredThought = await this.thoughtService.refactorThought(dto)
        if (refactoredThought) return refactoredThought
        else return { status: 0 }
    }

    @UseGuards(AuthGuard)
    @Delete('delete')
    async deleteThought(
        @Req() request: AuthReqInterface,
        @Query('thought-id', new ParseUUIDPipe()) thought_id: string
    ) {
        const dto: DeleteThoughtDto = { userId: request.user.sub, thoughtId: thought_id }
        const deletedThought = await this.thoughtService.deleteThought(dto)
        if (deletedThought) return { status: 1 }
        else return { status: 0 }
    }
}
