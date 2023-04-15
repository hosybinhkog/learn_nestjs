import { ConfigService } from "@nestjs/config"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { UserService } from "../user/user.service"
import bcrypt from "bcrypt"
import User from "../user/user.entity"
import { RegisterDto } from "./dto/registerDto.dto"
import { JwtService } from "@nestjs/jwt"
import { TokenPayload } from "./tokenPayload.interface"
@Injectable({})
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async register(registrationData: RegisterDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      registrationData.password,
      10
    )
    try {
      const createdUser: User = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
      })
      createdUser.password = undefined
      return createdUser
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          "User with that email already exists",
          HttpStatus.BAD_REQUEST
        )
      }
      throw new HttpException(
        "Something went wrong",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  public async getAuthenticatedUser(
    email: string,
    hashedPassword: string
  ): Promise<User> {
    try {
      const user: User = await this.userService.getByEmail(email)
      const isPasswordMatching: boolean = await bcrypt.compare(
        hashedPassword,
        user.password
      )
      if (!isPasswordMatching) {
        throw new HttpException(
          "Wrong credentials provided",
          HttpStatus.BAD_REQUEST
        )
      }
      user.password = undefined
      return user
    } catch (error) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST
      )
    }
  }
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    )
    if (!isPasswordMatching) {
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.BAD_REQUEST
      )
    }
  }
  public getCookieWithJwtToken(userId: number | string): string {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload)
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      "JWT_EXPIRATION_TIME"
    )}`
  }

  public getCookieForLogout(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`
  }
}
