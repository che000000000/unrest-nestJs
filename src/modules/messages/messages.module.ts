import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './model';
import { MembersOfDialogsModule } from '../members-of-dialogs/members-of-dialogs.module';
import { DialogsModule } from '../dialogs/dialogs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Message]),
    MembersOfDialogsModule,
    DialogsModule,
    UsersModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule { }
