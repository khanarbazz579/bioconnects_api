import { Injectable } from '@nestjs/common';
const converter = require('json-2-csv');
@Injectable()
export class CsvParserService {
  async jsonToCsv(data, writeColumnNames = true) {
    return new Promise((resolve, reject) => {
      converter.json2csv(
        data,
        { prependHeader: writeColumnNames },
        (err, csv) => {
          if (err) {
            throw err;
          }
          // print CSV string
          return resolve(csv);
        },
      );
    });
  }

  async _jsonToCsv(data, writeColumnNames = true){
    return new Promise((resolve, reject) => {
      converter.json2csv(
        data,
        { prependHeader: writeColumnNames },
        (err, csv) => {
          if (err) {
            throw err;
          }
          // print CSV string
          return resolve(Buffer.from(csv, 'utf-8'));
        },
      );
    });
  } 
}
