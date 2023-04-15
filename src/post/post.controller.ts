import { FindOneParams } from "./../utils/findOneParams"
import { CreatePostDto } from "./dtos/createPost.dto"
import { UpdatePostDto } from "./dtos/updatePostDto.dto"
import { PostService } from "./post.service"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common"
import JwtAuthenticationGuard from "src/authentication/jwt-authentication.guard"

@Controller("posts")
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts()
  }

  @Get(":id")
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id))
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post)
  }

  @Put(":id")
  async replacePost(@Param("id") id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post)
  }

  @Delete(":id")
  async deletePost(@Param("id") id: string) {
    await this.postsService.deletePost(Number(id))
  }
}
