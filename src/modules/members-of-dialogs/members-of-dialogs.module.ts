import { forwardRef, Module } from '@nestjs/common';
import { MembersOfDialogsController } from './members-of-dialogs.controller';
import { MembersOfDialogsService } from './members-of-dialogs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MemberOfDialog } from './model';
import { DialogsModule } from '../dialogs/dialogs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([MemberOfDialog]), forwardRef(() => DialogsModule), UsersModule],
  exports: [MembersOfDialogsService],
  controllers: [MembersOfDialogsController],
  providers: [MembersOfDialogsService]
})
export class MembersOfDialogsModule { }
