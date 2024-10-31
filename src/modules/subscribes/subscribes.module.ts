import { Module } from '@nestjs/common';
import { SubscribesController } from './subscribes.controller';
import { SubscribesService } from './subscribes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subscribe } from './model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Subscribe]), UsersModule],
  controllers: [SubscribesController],
  providers: [SubscribesService]
})
export class SubscribesModule {}
