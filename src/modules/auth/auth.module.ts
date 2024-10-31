import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: process.env.JWT_EXPIRE}
    })],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController]
})
export class AuthModule { }