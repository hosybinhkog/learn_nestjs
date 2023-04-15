import { NotFoundException } from "@nestjs/common"

class CategoryMotFoundException extends NotFoundException {
  constructor(postId: number | string) {
    super(`Category with id ${postId} not found`)
  }
}

export default CategoryMotFoundException
