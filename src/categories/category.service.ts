import { CreateCategoryDto } from "./dto/createCategory.dto"
import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import Category from "./category.entity"
import { InjectRepository } from "@nestjs/typeorm"
import CategoryMotFoundException from "./exceptions/categoryNotFound.exception"
import UpdateCategoryDto from "./dto/updateCategory.dto"

@Injectable()
export default class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryResponsitory: Repository<Category>
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoryResponsitory.find({
      relations: {
        posts: true,
      },
    })
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryResponsitory.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
      withDeleted: true,
    })

    if (category) {
      return category
    }

    throw new CategoryMotFoundException(id)
  }

  async restoreDeletedCategory(id: number): Promise<void> {
    const restoreResponse = await this.categoryResponsitory.restore(id)
    if (!restoreResponse.affected) {
      throw new CategoryMotFoundException(id)
    }
  }

  async categoryCategory(category: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.categoryResponsitory.create(category)
    await this.categoryResponsitory.save(newCategory)
    return newCategory
  }

  async updateCategory(
    id: number,
    category: UpdateCategoryDto
  ): Promise<Category> {
    await this.categoryResponsitory.update(id, category)
    const updatedCategory = await this.categoryResponsitory.findOne({
      where: { id },
      relations: {
        posts: true,
      },
    })

    if (updatedCategory) {
      return updatedCategory
    }

    throw new CategoryMotFoundException(id)
  }

  async deleteCategoryById(id: number): Promise<void> {
    return this.deleteCategory(id)
  }

  async deleteCategory(id: number): Promise<void> {
    const deleteResponse = await this.categoryResponsitory.softDelete(id)
    if (!deleteResponse.affected) {
      throw new CategoryMotFoundException(id)
    }
  }
}
