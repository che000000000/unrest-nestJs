import { forwardRef, Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialog } from './model';
import { UsersModule } from '../users/users.module';
import { MembersOfDialogsModule } from '../members-of-dialogs/members-of-dialogs.module';

@Module({
  imports: [SequelizeModule.forFeature([Dialog]), forwardRef(() => MembersOfDialogsModule), UsersModule],
  exports: [DialogsService],
  controllers: [DialogsController],
  providers: [DialogsService]
})
export class DialogsModule { }