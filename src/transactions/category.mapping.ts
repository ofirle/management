import { Category, Type } from './dto/enums';

export const categoriesTitleMapping = new Map<Category, string>([
  [Category.APARTMENT_RENT, 'Apartment Rent'],
]);

export const transactionsTypeTitleMapping = new Map<Type, string>([
  [Type.INCOME, 'Income'],
  [Type.EXPENSE, 'Expense'],
]);
