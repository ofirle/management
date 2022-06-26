import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesRepository } from '../categories/categories.repository';
import { Category } from '../categories/categories.entity';
import { getManager, In, Not } from 'typeorm';
import { ActionsEnum } from '../shared/enum';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { RolesRepository } from '../roles/roles.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { AuthSignupDto } from '../auth/dto/auth-signup.dto';
import { Admins } from '../roles/enum';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
    private permissionsRepository: PermissionsRepository,
    private rolesRepository: RolesRepository,
    private accountRepository: AccountsRepository,
    private usersRepository: AuthRepository,
  ) {}

  async createSeeds(): Promise<void> {
    await this.createCategories();
    await this.createPermissions();
    await this.createRoles();
    await this.createUsers();
    await this.createAccount();
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

  async createPermissions() {
    const data = [
      {
        title: 'Create Account',
        action: ActionsEnum.CreateAccount,
        entity: 'account',
      },
      {
        title: 'Attach User to Account',
        action: ActionsEnum.AttachAccountUser,
        entity: 'account',
      },
      {
        title: 'Create Category',
        action: ActionsEnum.CreateCategory,
        entity: 'category',
      },
      {
        title: 'Read Category',
        action: ActionsEnum.ReadCategory,
        entity: 'category',
      },
      {
        title: 'Read Categories',
        action: ActionsEnum.ReadCategories,
        entity: 'category',
      },
      {
        title: 'Create Permission',
        action: ActionsEnum.CreatePermission,
        entity: 'permission',
      },
      {
        title: 'Read Permissions',
        action: ActionsEnum.ReadPermissions,
        entity: 'permission',
      },
      {
        title: 'Create Role',
        action: ActionsEnum.CreateRole,
        entity: 'role',
      },
      {
        title: 'Read Roles',
        action: ActionsEnum.ReadRoles,
        entity: 'role',
      },
      {
        title: 'Update Role Permission',
        action: ActionsEnum.UpdateRolePermission,
        entity: 'role',
      },
      {
        title: 'Update Role',
        action: ActionsEnum.UpdateRole,
        entity: 'role',
      },
      {
        title: 'Delete Role',
        action: ActionsEnum.DeleteRole,
        entity: 'role',
      },
      {
        title: 'Create Source',
        action: ActionsEnum.CreateSource,
        entity: 'source',
      },
      {
        title: 'Read Transactions',
        action: ActionsEnum.ReadTransactions,
        entity: 'transaction',
      },
      {
        title: 'Read Transaction',
        action: ActionsEnum.ReadTransaction,
        entity: 'transaction',
      },
      {
        title: 'Create Transaction',
        action: ActionsEnum.CreateTransaction,
        entity: 'transaction',
      },
      {
        title: 'Import Transactions',
        action: ActionsEnum.ImportTransactions,
        entity: 'transaction',
      },
      {
        title: 'Read User',
        action: ActionsEnum.ReadUser,
        entity: 'user',
      },
      {
        title: 'Read Users',
        action: ActionsEnum.ReadUsers,
        entity: 'user',
      },
      {
        title: 'Attach Role to User',
        action: ActionsEnum.AttachUserRole,
        entity: 'user',
      },
      {
        title: 'Update User',
        action: ActionsEnum.UpdateUser,
        entity: 'user',
      },
    ];

    await this.permissionsRepository.save(data);
  }

  async createRoles() {
    const data = [
      {
        title: 'Super Admin',
        key: Admins.SuperAdmin,
        permissions: await this.permissionsRepository.find(),
      },
      {
        title: 'Admin',
        key: Admins.Admin,
        permissions: await this.permissionsRepository.find({
          action: Not(
            In([
              ActionsEnum.CreatePermission,
              ActionsEnum.UpdateRolePermission,
              ActionsEnum.UpdateRolePermission,
              ActionsEnum.DeleteRole,
              ActionsEnum.CreateRole,
            ]),
          ),
        }),
      },
      {
        title: 'Viewer',
        key: Admins.Viewer,
        permissions: await this.permissionsRepository.find({
          action: In([
            ActionsEnum.ReadPermissions,
            ActionsEnum.ReadRoles,
            ActionsEnum.ReadTransactions,
            ActionsEnum.ReadTransaction,
            ActionsEnum.ReadUser,
            ActionsEnum.ReadUsers,
            ActionsEnum.ReadCategories,
            ActionsEnum.ReadCategory,
          ]),
        }),
      },
    ];

    await this.rolesRepository.save(data);
  }

  async createUsers() {
    const users: AuthSignupDto[] = [
      {
        username: 'ofirle',
        password: '123123',
        email: 'ofirle92@gmail.com',
        name: 'Ofir Levy',
        image:
          'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/man-vector-design-template-1ba90da9b45ecf00ceb3b8ae442ad32c_screen.jpg?ts=1601484738',
        role: await this.rolesRepository.findOne({ key: Admins.SuperAdmin }),
      },
      {
        username: 'danielzipo',
        password: '123123',
        email: 'danielzipo@gmail.com',
        name: 'Daniel Zipori',
        image:
          'https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png',
        role: await this.rolesRepository.findOne({ key: Admins.Admin }),
      },
    ];
    return await Promise.all(
      users.map((user) => {
        return this.usersRepository.createUser(user);
      }),
    );
  }

  async createAccount() {
    const ofirleUser = await this.usersRepository.findOne({
      username: 'ofirle',
    });
    const secret = 'ofirdaniel';
    const account = await this.accountRepository.createAccount(
      {
        title: 'Ofir and Daniel',
        secret,
      },
      ofirleUser,
    );
    const danielUser = await this.usersRepository.findOne({
      username: 'danielzipo',
    });
    await this.accountRepository.attachUser(account.id, { secret }, danielUser);
  }
}
