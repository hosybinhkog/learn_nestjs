import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import User from "./user.entity"
import { Repository } from "typeorm"
import CreateUserDto from "./dto/createUser.dto"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (user) {
      return user
    }
    throw new HttpException(
      "User with this email does not exist",
      HttpStatus.NOT_FOUND
    )
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(userData)
    await this.userRepository.save(newUser)
    return newUser
  }

  async getById(id: number | string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id as number },
    })

    if (!user)
      throw new HttpException(
        "User with this id does not found",
        HttpStatus.NOT_FOUND
      )

    return user
  }

  getAllAddressWithUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ["user"] })
  }
}
