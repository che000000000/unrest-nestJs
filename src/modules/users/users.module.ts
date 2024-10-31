import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    ConfigModule
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard]
})
export class UsersModule { }