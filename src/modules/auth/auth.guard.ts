import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AppError } from "src/common/errors";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies['jwt']
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromCookie(request)
        if (!token) throw new UnauthorizedException(AppError.AUTHORIZATION_ERROR)
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('jwt.secret')
            })
            request['user'] = payload
        } catch {
            throw new UnauthorizedException(AppError.AUTHORIZATION_ERROR)
        }
        return true
    }
}