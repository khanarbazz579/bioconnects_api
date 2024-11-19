import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/core/user/user.model';

@Table({ tableName: 'subscriptions' })
export class Subscriptions extends Model<Subscriptions> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;
  

  @Column({
    type: DataType.DATE,
    field: 'start_date',
  })
  startDate: string;

  
  @Column({
    type: DataType.DATE,
    field: 'end_date',
  })
  endDate: string;
  
  @Column({
    type: DataType.STRING,
    field: 'email',
  })
  email: string;
  
    
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
