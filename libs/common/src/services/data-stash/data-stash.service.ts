import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CanContextService } from '..';
import { ConfigService } from '@nestjs/config';
import { ApiService } from 'src/common/services/api/api.service';
import { DataStash_Payload } from './data-stash.dto';
import { QueryService } from 'src/core/query/query.service';

@Injectable()
export class DataStashService {
  constructor() {}

  async dataStash(request, response, config) {
    try {
      const queryService = CanContextService.getAppContext().get(QueryService);
      const configService =
        CanContextService.getAppContext().get(ConfigService);

      let id;
      if (
        request &&
        request.dataStashMethod &&
        request.dataStashMethod === 'exception'
      ) {
        const payload = [
          {
            pk: `${config.tableName}`,
            uuid: `${config.tableName}`,
            app: configService.get('APP'),
            eml: request.user.email,
            data: {
              path: `${request.method} | ${request.url}`,
              req: request.body,
              res: JSON.parse(JSON.stringify(response)),
            },
          },
        ];
        this.sendData(payload);
      } else {
        if (request && request.params && request.params.id) {
          id = request.params.id;
        } else if (response && response.id) {
          id = response.id;
        }
        if (config && config.tableContext) {
          let pk = '';
          let uuid = '';
          let tableData;
          const contextTable = CanContextService.getAppContext().get(
            config.tableContext,
          );
          if (request.method === 'PATCH' && request.params) {
            if (id) {
              tableData = await contextTable.findById(id);
            } else if (config.params && request.params[config.params]) {
              const filter = { where: {} };
              filter['where'][config.params] = request.params[config.params];
              tableData = await contextTable.findOne(filter);
            }
          } else if (request.method === 'POST') {
            tableData = response.toJSON();
          }
          if (config.pk && Array.isArray(config.pk) && config.pk.length) {
            for (let index = 0; index < config.pk.length; index++) {
              if (index == 0) {
                pk = tableData[config.pk[index]];
              } else {
                pk = pk + ':' + tableData[config.pk[index]];
              }
            }
          } else {
            pk = `${id}`;
          }

          if (config.uuid && Array.isArray(config.uuid) && config.uuid.length) {
            for (let index = 0; index < config.pk.length; index++) {
              if (index == 0) {
                uuid = tableData[config.uuid[index]];
              } else {
                uuid = uuid + '-' + tableData[config.uuid[index]];
              }
            }
          } else {
            uuid = `${id}`;
          }
          const payload = [
            {
              pk: `${pk}`,
              uuid: `${config.tableName}:${uuid}`,
              app: configService.get('APP'),
              eml: request.user.email,
              data: {
                path: `${request.method} | ${request.url}`,
                req: request.body,
                res: JSON.parse(JSON.stringify(response)),
              },
            },
          ];
          this.sendData(payload);
        } else {
          const query = await this.generateQuery(config, id);
          const queryRes = await queryService.executeQuery<any[]>(query);
          let pk = '';
          let uuid = `${config.tableName}:`;
          for (let index = 0; index < config.pk.fields.length; index++) {
            if (index == 0) {
              pk = queryRes[0][config.pk.fields[index]];
            } else {
              pk =
                pk + config.pk.separator + queryRes[0][config.pk.fields[index]];
            }
          }
          for (let index = 0; index < config.uuid.fields.length; index++) {
            if (queryRes[0][config.uuid.fields[index]]) {
              if (index == 0) {
                uuid = uuid + queryRes[0][config.uuid.fields[index]];
              } else {
                uuid =
                  uuid +
                  config.uuid.separator +
                  queryRes[0][config.uuid.fields[index]];
              }
            } else {
              uuid += config.uuid.separator + config.uuid.fields[index];
            }
          }

          if (queryRes && Array.isArray(queryRes) && queryRes.length !== 0) {
            const payload = [
              {
                pk: `${pk}`,
                uuid: uuid,
                app: configService.get('APP'),
                eml: request.user.email,
                data: {
                  path: `${request.method} | ${request.url}`,
                  req: request.body,
                  res: response,
                },
              },
            ];
            this.sendData(payload);
            //console.log(queryRes);
          }
        }
      }
    } catch (error) {
      //console.log('Data Stash error', error);
    }
  }

  async generateQuery(config, id) {
    let joinQuery = ``;
    let foreignColumn = [''];
    let column = [];
    if (
      config &&
      config.relations &&
      Array.isArray(config.relations) &&
      config.relations.length !== 0
    ) {
      for (let index = 0; index < config.relations.length; index++) {
        joinQuery =
          joinQuery +
          ` JOIN ${config.relations[index].fTable} on ${config.tableName}.${config.relations[index].fKey} = ${config.relations[index].fTable}.${config.relations[index].key} `;
        for (let j = 0; j < config.relations[index].fColumn.length; j++) {
          foreignColumn.push(
            `${config.relations[index].fTable}.${config.relations[index].fColumn[j].columnName} as "${config.relations[index].fColumn[j].alias}"`,
          );
        }
      }
    }

    for (let index = 0; index < config.column.length; index++) {
      column.push(`${config.tableName}.${config.column[index]}`);
    }

    let query = `select ${column} ${foreignColumn} from ${config.tableName} ${joinQuery} where ${config.tableName}.id=${id}`;
    return query;
  }

  async sendData(data: DataStash_Payload[]) {
    const configService = CanContextService.getAppContext().get(ConfigService);
    const apiService = CanContextService.getAppContext().get(ApiService);
    try {
      const reqOption: any = {
        url: `${configService.get('DATA_STASH_URL')}/add-data`,
        method: 'post',
        data: data,
        headers: {
          'x-api-key': configService.get('DATA_STASH_APP_KEY'),
        },
      };

      if (reqOption && (!reqOption.url || !reqOption.headers['x-api-key'])) {
        throw new InternalServerErrorException('Data stash creds missing');
      }
      //console.log('DataStash Request', reqOption);
      const stashdata = await apiService.request(reqOption);
      //console.log('Data Stash - ', stashdata);
    } catch (error) {
      //console.log('Datastah Error', error);
    }
  }
}
