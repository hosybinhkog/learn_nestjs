import { PostNotFoundException } from "./exception/postNotFund.exception"
import { Post } from "./interfaces/post.interface"
import { UpdatePostDto } from "./dtos/updatePostDto.dto"
import { CreatePostDto } from "./dtos/createPost.dto"
import { Injectable, HttpException, HttpStatus } from "@nestjs/common"

import { InjectRepository } from "@nestjs/typeorm"
import PostEntity from "./post.entity"
import { Repository } from "typeorm"

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>
  ) {}

  getAllPosts(): Promise<PostEntity[]> {
    return this.postsRepository.find()
  }

  getPostById(id: number): Promise<PostEntity> {
    const post = this.postsRepository.findOne({
      where: { id },
      relations: ["author"],
    })
    if (post) {
      return post
    }
    throw new PostNotFoundException(id)
  }

  async updatePost(id: number, post: UpdatePostDto): Promise<PostEntity> {
    await this.postsRepository.update(id, post)
    const updatePost = await this.postsRepository.findOne({
      where: { id },
      relations: ["author"],
    })
    if (updatePost) return updatePost

    throw new PostNotFoundException(id)
  }

  async createPost(post: CreatePostDto): Promise<PostEntity> {
    const newPost = await this.postsRepository.create(post)
    await this.postsRepository.save(newPost)
    return newPost
  }

  async deletePost(id: number): Promise<void> {
    const deleteResponse = await this.postsRepository.delete(id)
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id)
    }
  }
}
