export enum ActionsEnum {
  //accounts
  CreateAccount = 'CREATE_ACCOUNT',
  AttachAccountUser = 'ATTACH_ACCOUNT_USER',
  //categories
  CreateCategory = 'CREATE_CATEGORY',
  ReadCategory = 'READ_CATEGORY',
  ReadCategories = 'READ_CATEGORIES',
  //permissions
  CreatePermission = 'CREATE_PERMISSION',
  ReadPermissions = 'READ_PERMISSION',
  //roles
  CreateRole = 'CREATE_ROLE',
  ReadRoles = 'READ_ROLES',
  UpdateRolePermission = 'UPDATE_ROLE_PERMISSION',
  UpdateRole = 'UPDATE_ROLE',
  DeleteRole = 'DELETE_ROLE',
  //sources
  CreateSource = 'CREATE_SOURCE',
  //transactions
  ReadTransactions = 'READ_TRANSACTIONS',
  DeleteTransaction = 'DELETE_TRANSACTION',
  ReadTransaction = 'READ_TRANSACTION',
  CreateTransaction = 'CREATE_TRANSACTION',
  ImportTransactions = 'IMPORT_TRANSACTIONS',
  //users
  ReadUser = 'READ_USER',
  ReadUsers = 'READ_USERS',
  UpdateUser = 'UPDATE_USERS',
  AttachUserRole = 'ATTACH_USER_ROLE',
}
