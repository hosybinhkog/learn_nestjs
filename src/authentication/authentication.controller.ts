import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from "@nestjs/common"
import User from "../user/user.entity"
import { AuthenticationService } from "./authentication.service"
import RegisterDto from "../auth/dto/register.dto"
import { localAuthenticationGuard } from "./localAuthentication.guard"
import RequestWithUser from "./RequestWithUser.interface"
import { Response } from "express"
import JwtAuthenticationGuard from "./jwt-authentication.guard"

@Controller("authentication")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: "excludeAll",
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  async register(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authenticationService.register(registrationData)
  }

  @HttpCode(200)
  @UseGuards(localAuthenticationGuard)
  @Post("log-in")
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id)
    request.res.setHeader("Set-Cookie", cookie)
    return user
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("log-out")
  async logOut(@Res() response: Response) {
    response.setHeader(
      "Set-Cookie",
      this.authenticationService.getCookieForLogout()
    )

    return response.sendStatus(200)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser): User {
    const user = request.user
    user.password = undefined
    return user
  }
}
