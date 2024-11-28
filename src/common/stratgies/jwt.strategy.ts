import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models/user.model";
import { UUID } from "crypto";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, @InjectModel(User) private readonly UserModel: typeof User) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_SECRET')
        });
    }

    async validate(payload: {
        sub: UUID,
        email: string
    }) {
        const user: User = await this.UserModel.findOne({
            where: {
                id: payload.sub
            }
        });
        if (!user) {
            throw new NotFoundException('User not found')
        }
        delete user.hash;
        return user;
    }

}