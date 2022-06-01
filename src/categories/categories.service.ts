import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from './categories.repository';
import { User } from '../users/user.entity';
import { Category } from './categories.entity';
import { createCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async createCategory(data: createCategoryDto, user: User): Promise<Category> {
    return this.categoriesRepository.createCategory(data, user);
  }

  async getCategory(id: number, user: User): Promise<Category> {
    return this.categoriesRepository.getCategory(id, user);
  }

  async getCategories(user: User): Promise<Category[]> {
    return this.categoriesRepository.getCategories(user);
  }
}
