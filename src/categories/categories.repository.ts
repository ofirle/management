import { EntityRepository, getManager, Repository } from 'typeorm';
import { Category } from './categories.entity';
import { User } from '../users/user.entity';
import { createCategoryDto } from './dto/create-category.dto';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  getCategoryDescendantsIds(tree) {
    const descendantsIds = [tree.id];
    if (tree.children.length === 0) return descendantsIds;
    tree.children.forEach((children) => {
      descendantsIds.push(...this.getCategoryDescendantsIds(children));
    });
    return descendantsIds;
  }

  async getFlatDescendantsIds(categoryIds) {
    const categoryDescendantsIds = [];
    const categories = await getManager()
      .getTreeRepository(Category)
      .findByIds(categoryIds);
    for (const category of categories) {
      const descendantsTree = await getManager()
        .getTreeRepository(Category)
        .findDescendantsTree(category);
      categoryDescendantsIds.push(
        ...this.getCategoryDescendantsIds(descendantsTree),
      );
    }

    return categoryDescendantsIds;
  }

  async createCategory(data: createCategoryDto, user: User): Promise<Category> {
    const manager = getManager();
    const category = this.create({
      title: data.title,
      description: data.description,
    });
    try {
      if (data.parent) {
        category.parent = data.parent;
      }
      category.user = user;
      category.account = user.account;
      await manager.save(category);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
    return category;
  }

  async getCategory(id: number, user: User): Promise<Category> {
    try {
      const category = await this.findOne({ id, user });
      const manager = getManager();
      const trees = await manager.getTreeRepository(Category).findTrees();

      console.log(trees);
      return category;
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  parseCategoriesRec = (trees: Category[]) => {
    trees.forEach((node: Category) => {
      // node.value = node.id;
      if (node.children.length === 0) return;
      this.parseCategoriesRec(node.children);
      // node.children.forEach((child: Category) => {
      //   this.parseCategoriesRec(child);
      // });
    });
    return trees;
  };

  async getCategories(user: User): Promise<Category[]> {
    try {
      const manager = getManager();
      let trees = await manager.getTreeRepository(Category).findTrees();

      trees = this.parseCategoriesRec(trees);
      console.log(trees);

      return trees;
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }
}
