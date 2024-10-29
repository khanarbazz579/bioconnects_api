import { PipeTransform, Injectable } from '@nestjs/common';
import { decodeUriValues } from '../utils/parser';

@Injectable()
export class ParseFilterPipe implements PipeTransform {
  transform(value) {
    try {
      const filter = value ? decodeURI(value) : value;
      return decodeUriValues(filter);
    } catch (error) {
      return decodeUriValues(value);
    }
  }
}
