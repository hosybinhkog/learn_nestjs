import { TokenPayload } from "./tokenPayload.interface"
import { UserService } from "./../user/user.service"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { Strategy } from "passport-local"
import { ExtractJwt } from "passport-jwt"
import { Request } from "express"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: configService.get("JWT_SECRET"),
    })
  }

  async validate(payload: TokenPayload) {
    return this.userService.getById(payload.userId)
  }
}
