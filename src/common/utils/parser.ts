import { Model } from 'sequelize';
import { Op } from 'sequelize';
import * as _ from 'lodash';
import {
  CanExportResponseData,
  CanExportResponseOption,
} from '@can/common/types/export-response.type';

/**
 * Parse Model to Plain Object
 *
 * @param model : Model
 *
 * @return U
 */
export function parseModelToJson<T extends Model, U>(model: T): U {
  const obj: any = model.toJSON();
  return obj;
}

export function decodeUriValues(
  value: string,
  isLimitFilterRequired: boolean = false,
) {
  try {
    return parseQueryToSequalizeQuery(JSON.parse(value), isLimitFilterRequired);
  } catch (error) {
    return value;
  }
}

/**
 *
 * Parse Incoming Query Params to Sequalize Query Params
 *
 * @param query : any
 */
export function parseQueryToSequalizeQuery(
  query: any,
  isLimitFilterRequired: boolean,
): any {
  //console.log('ParseQueryToSequalizeQuery');
  //console.log(process.env.pm_id, 'process.env.pm_id');
  if (
    !query.hasOwnProperty('limit') &&
    !excelExport(query) &&
    !isLimitFilterRequired
  ) {
    query['limit'] = process.env.REQUEST_LIMIT
      ? process.env.REQUEST_LIMIT
      : 200;
  }
  removeExportQuery(query);
  return renameOperatorInQuery(query);
}

function excelExport(query: any) {
  const index =
    query && query['where'] && query['where']['and']
      ? query['where']['and'].findIndex((q: any) =>
          q.hasOwnProperty('exportExcel'),
        )
      : -1;
  if (
    query.hasOwnProperty('exportExcel') ||
    query['where']['exportExcel'] ||
    (index >= 0 && query['where']['and'][index]['exportExcel'])
  )
    return true;
}

export function removeExportQuery(query: any) {
  /**
   * Manipulate Query
   */
  let exportQuery: CanExportResponseOption;
  if (query) {
    if (query.hasOwnProperty('where')) {
      if (query['where'].hasOwnProperty('exportExcel')) {
        exportQuery = {
          ...query['where']['exportExcel'],
        };
        delete query['where']['exportExcel'];
      } else if (query['where'].hasOwnProperty('and')) {
        const index = query['where']['and'].findIndex((q: any) =>
          q.hasOwnProperty('exportExcel'),
        );
        if (index >= 0) {
          exportQuery = query['where']['and'][index]['exportExcel'];
          (query['where']['and'] as CanExportResponseData[]).splice(index, 1);
          if (query['where']['and'].length === 0) {
            delete query['where']['and'];
          }
        }
      }
    } else if (query.hasOwnProperty('exportExcel')) {
      exportQuery = query['exportExcel'];
      delete query['exportExcel'];
    }
  }

  if (exportQuery) {
    if (
      !Object.keys(query).length ||
      ('where' in query && Object.keys(query['where']).length === 1)
    ) {
      // query = JSON.stringify({ raw: true });
      // query['raw'] = true;
      query = JSON.stringify(query);
    } else {
      // query['raw'] = true;
      query = JSON.stringify(query);
    }
  } else {
    query = JSON.stringify(query);
  }

  return {
    exportQuery,
    query,
  };
}
/**
 *
 * Rename Operator in Query Params According to Sequalize Opearator
 *
 * @param query : any
 */
function renameOperatorInQuery(query: any) {
  if (_.isObject(query)) {
    Object.keys(query).map(key => {
      if (_.isObject(query[key])) {
        query[key] = renameOperatorInQuery(query[key]);
      }
      if (_.isArray(query[key])) {
        query[key] = query[key].map(q => renameOperatorInQuery(q));
      }
      if (key === 'and') {
        query[Op.and] = query['and'];
        delete query['and'];
      }
      if (key === 'or') {
        query[Op.or] = query['or'];
        delete query['or'];
      }
      if (key === 'like') {
        query[Op.like] = query['like'];
        delete query['like'];
      }
      if (key === 'ilike') {
        query[Op.iLike] = query['ilike'];
        delete query['ilike'];
      }
      if (key === 'between') {
        query[Op.between] = query['between'];
        delete query['between'];
      }
      if (key === 'gte') {
        query[Op.gte] = query['gte'];
        delete query['gte'];
      }
      if (key === 'lte') {
        query[Op.lte] = query['lte'];
        delete query['lte'];
      }
      if (key === 'gt') {
        query[Op.gt] = query['gt'];
        delete query['gt'];
      }
      if (key === 'lt') {
        query[Op.lt] = query['lt'];
        delete query['lt'];
      }
      if (key === 'ne') {
        query[Op.ne] = query['ne'];
        delete query['ne'];
      }
      if (key === 'is') {
        query[Op.is] = query['is'];
        delete query['is'];
      }
      if (key === 'in') {
        query[Op.in] = query['in'];
        delete query['in'];
      }
      if (key === 'notIn') {
        query[Op.notIn] = query['notIn'];
        delete query['notIn'];
      }
      if (key === 'notBetween') {
        query[Op.notBetween] = query['notBetween'];
        delete query['notBetween'];
      }
    });
  }
  return query;
}
