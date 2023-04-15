import { TypeOrmModule } from "@nestjs/typeorm"
import { Module } from "@nestjs/common"
import { PostController } from "./post.controller"
import { PostService } from "./post.service"
import Post from "./post.entity"

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([Post])],
})
export class PostModule {}
