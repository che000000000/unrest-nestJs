import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/configurations/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/model';
import { Thought } from 'src/modules/thoughts/model';
import { ThoughtsModule } from 'src/modules/thoughts/thoughts.module';
import { DialogsModule } from '../dialogs/dialogs.module';
import { Dialog } from '../dialogs/model';
import { Message } from '../messages/model';
import { MessagesModule } from '../messages/messages.module';
import { MemberOfDialog } from '../members-of-dialogs/model';
import { MembersOfDialogsModule } from '../members-of-dialogs/members-of-dialogs.module';
import { AuthModule } from '../auth/auth.module';
import { Subscribe } from '../subscribes/model';
import { SubscribesModule } from '../subscribes/subscribes.module';

@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }), SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      dialect: 'postgres',
      port: configService.get('database.port'),
      host: configService.get('database.host'),
      username: configService.get('database.user'),
      database: configService.get('database.name'),
      password: configService.get('database.password'),
      synchronize: true,
      autoLoadModels: true,
      models: [User, Thought, Subscribe, Dialog, MemberOfDialog, Message]
    })
  }),
    UsersModule, ThoughtsModule, SubscribesModule, DialogsModule, MessagesModule,
    MembersOfDialogsModule, AuthModule
  ]
})
export class AppModule { }
