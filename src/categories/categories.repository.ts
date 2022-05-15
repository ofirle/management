import { EntityRepository, getManager, Repository } from 'typeorm';
import { Category } from './categories.entity';
import { User } from '../users/user.entity';
import { createCategoryDto } from './dto/create-category.dto';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async createCategory(data: createCategoryDto, user: User): Promise<Category> {
    const manager = getManager();
    const category = this.create({
      title: data.title,
      description: data.description,
    });
    try {
      if (data.parent) {
        const parentCategory = await manager.findOne(Category, data.parent);
        if (parentCategory) {
          category.parent = parentCategory;
        }
      }
      await manager.save(category);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
    return category;
  }

  async getCategory(id: number, user: User): Promise<Category> {
    try {
      const category = await this.findOne({ id });
      // const children = await this.findDescendants({ id });
      const manager = getManager();
      const trees = await manager.getTreeRepository(Category).findTrees();

      console.log(trees);
      return category;
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }
}
