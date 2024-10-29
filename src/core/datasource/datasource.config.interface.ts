import { SequelizeOptions } from 'sequelize-typescript';

export interface ICanDatasourceConfig {
  dataSourceConfiguration: ICanDatasourceConfigAttributes;
}

export interface ICanDatasourceConfigAttributes extends SequelizeOptions {}
