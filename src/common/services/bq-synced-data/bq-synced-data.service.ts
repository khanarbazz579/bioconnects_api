import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TopSFRDataDto } from './bq-synced-data.dto';
import { Query } from 'src/common/services/query/query';
import { QueryService } from 'src/core/query/query.service';

@Injectable()
export class BqSyncedDataService {
  constructor(private readonly queryService: QueryService) {}

  async getTopSFRKeywords(gbSku: string): Promise<string[]> {
    const dbResponseData: any[] = await this.queryService.executeQuery(
      Query.getTopSfrKeywordsForGbSku(gbSku),
    );

    if (dbResponseData?.length > 1)
      throw new InternalServerErrorException(
        'Having two values for one gbSku in bq-synced-table, `product_keyword_ranks',
      );

    try {
      const responseDto: string[] = dbResponseData[0]?.keywords?.map(
        ({ keyword }) => keyword,
      );
      return responseDto;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Error while serialization of db response of TopSFRKeywords',
      );
    }
  }
}
