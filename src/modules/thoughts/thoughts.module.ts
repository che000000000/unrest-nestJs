import { Module } from '@nestjs/common';
import { ThoughtsController } from './thoughts.controller';
import { ThoughtsService } from './thoughts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Thought } from './model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Thought]), UsersModule],
  controllers: [ThoughtsController],
  providers: [ThoughtsService]
})
export class ThoughtsModule {}
