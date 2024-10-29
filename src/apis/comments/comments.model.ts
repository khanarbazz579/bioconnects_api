import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/core/user/user.model';
import { Blogs } from '../blogs/blogs.model';

@Table({ tableName: 'comments' })
export class Comments extends Model<Comments> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    field: 'comment'
  })
  comment: string;

  @ForeignKey(() => Blogs)
  @Column({
    type: DataType.INTEGER,
    field: 'blog_id',
  })
  blogId: number;

  @BelongsTo(() => Blogs, 'blogId')
  blog: Blogs;
    
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
