import { Body, Controller, Delete, Get, ParseIntPipe, ParseUUIDPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { AuthReqInterface } from 'src/interfaces/auth-request.interface';
import { UpdateUserViewBodyDto, UpdateUserViewDto } from './dto/update-user-view.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get('profile')
    getUserProfile(@Req() request: AuthReqInterface, @Query('user-id', new ParseUUIDPipe({ optional: true })) user_id?: string | null) {
        const dto: GetUserProfileDto = { userId: user_id ? user_id : request.user.sub }
        return this.usersService.getUserProfile(dto)
    }

    @UseGuards(AuthGuard)
    @Get('page')
    getUsersPage(@Query('page', new ParseIntPipe()) page: number, @Query('size', new ParseIntPipe()) size: number) {
        const dto = { pageNumber: page, pageSize: size }
        return this.usersService.getUsersPage(dto)
    }

    @UseGuards(AuthGuard)
    @Patch('update')
    updateUser(@Req() request: AuthReqInterface, @Body() body: UpdateUserViewBodyDto) {
        const dto: UpdateUserViewDto = {userId: request.user.sub, toUpdate: body}
        return this.usersService.updateUserView(dto)
    }

    @UseGuards(AuthGuard)
    @Delete('delete')
    deleteUser(@Req() request: AuthReqInterface) {
        const dto: DeleteUserDto = { userId: request.user.sub }
        return this.usersService.deleteUser(dto)
    }
}