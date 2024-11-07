import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/core/user/user.model';
import { Category } from '../category/category.model';

@Table({ tableName: 'blogs' })
export class Blogs extends Model<Blogs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;
  

  @Column({
    type: DataType.STRING,
    field: 'status',
    defaultValue: 'pending'
  })
  status: 'pending' | 'accepted' | 'rejected';

  @Column({
    type: DataType.STRING,
    field: 'title',
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    field: 'banner_image'
  })
  bannedImage: string;

  @Column({
    type: DataType.TEXT,
    field: 'description',
    defaultValue:' test'
  })
  description: string;


  @Column({
    type: DataType.TEXT,
    field: 'body'
  })
  body: string;

  @Column({
    type: DataType.DATE,
    field: 'published_at',
  })
  publishedAt: string;
  
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    field: 'category_id',
  })
  categoryId: number;

  @BelongsTo(() => Category, 'categoryId')
  category: Category;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'created_by_id',
  })
  createdById: number;

  @BelongsTo(() => User, 'createdById')
  createdBy: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'updated_by_id',
  })
  updatedById: number;

  @BelongsTo(() => User, 'updatedById')
  updatedBy: User;
}
