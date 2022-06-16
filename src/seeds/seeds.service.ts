import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from '../categories/categories.repository';
import { Category } from '../categories/categories.entity';
import { getManager } from 'typeorm';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async createSeeds(): Promise<void> {
    await this.createCategories();
  }

  async createCategories() {
    const manager = getManager().getTreeRepository(Category);
    const categoryExpense = new Category();
    categoryExpense.title = 'Expense';
    await manager.save(categoryExpense);
    const categoryHousehold = manager.create({
      title: 'Household',
      parent: categoryExpense,
    });
    await manager.save(categoryHousehold);
    const categoryBills = manager.create({
      title: 'Bills',
      parent: categoryHousehold,
    });
    await manager.save(categoryBills);

    const categoryElectricity = manager.create({
      title: 'Electricity',
      parent: categoryBills,
    });
    await manager.save(categoryElectricity);

    const categoryGas = manager.create({
      title: 'Gas',
      parent: categoryBills,
    });
    await manager.save(categoryGas);

    const categoryWater = manager.create({
      title: 'Water',
      parent: categoryBills,
    });
    await manager.save(categoryWater);

    const categoryHouseCommittee = manager.create({
      title: 'House Committee',
      parent: categoryBills,
    });
    await manager.save(categoryHouseCommittee);

    const categoryCommunication = manager.create({
      title: 'Communication',
      parent: categoryHousehold,
    });
    await manager.save(categoryCommunication);

    const categoryPhone = manager.create({
      title: 'Phone',
      parent: categoryCommunication,
    });
    await manager.save(categoryPhone);

    const categoryTvInternet = manager.create({
      title: 'TV & Internet',
      parent: categoryCommunication,
    });
    await manager.save(categoryTvInternet);

    const categoryInsurance = manager.create({
      title: 'Insurance',
      parent: categoryHousehold,
    });
    await manager.save(categoryInsurance);

    const categoryMaintenance = manager.create({
      title: 'Maintenance & Repair',
      parent: categoryHousehold,
    });
    await manager.save(categoryMaintenance);

    const categoryCleaning = manager.create({
      title: 'Cleaning',
      parent: categoryHousehold,
    });
    await manager.save(categoryCleaning);

    const categoryRent = manager.create({
      title: 'Rent',
      parent: categoryHousehold,
    });
    await manager.save(categoryRent);

    const categorySupermarket = manager.create({
      title: 'Supermarket',
      parent: categoryHousehold,
    });
    await manager.save(categorySupermarket);

    const categoryHouseholdOthers = manager.create({
      title: 'Others',
      parent: categoryHousehold,
    });
    await manager.save(categoryHouseholdOthers);

    const categoryExpenseOthers = manager.create({
      title: 'Others',
      parent: categoryExpense,
    });
    await manager.save(categoryExpenseOthers);

    const categoryIncome = manager.create({
      title: 'Income',
    });
    await manager.save(categoryIncome);

    const categoryPaycheck = manager.create({
      title: 'Paycheck',
      parent: categoryIncome,
    });
    await manager.save(categoryPaycheck);

    const categoryGift = manager.create({
      title: 'Gift',
      parent: categoryIncome,
    });
    await manager.save(categoryGift);

    const categoryIncomeOthers = manager.create({
      title: 'Others',
      parent: categoryIncome,
    });
    await manager.save(categoryIncomeOthers);
  }
}
