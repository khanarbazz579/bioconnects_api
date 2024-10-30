import { Model, ModelCtor } from 'sequelize-typescript';
import { User } from './core/user/user.model';
import { UserRole } from './core/auth/user-role/user-role.model';
import { RolePermission } from './core/auth/role-permission/role-permission.model';
import { Role } from './core/auth/role/role.model';
import { Permission } from './core/auth/permission/permission.model';
import { Comments } from './apis/comments/comments.model';
import { Blogs } from './apis/blogs/blogs.model';
import { Category } from './apis/category/category.model';


export const MODELS: ModelCtor<Model<any, any>>[] = [
  // Define your models here
  User,
  UserRole,
  RolePermission,
  Role,
  Permission,
  Comments,
  Blogs,
  Category
  
];
