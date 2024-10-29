import { Module } from '@nestjs/common';
import { CanDatasourceModule } from '../datasource/datasource.module';
import { QueryService } from './query.service';

@Module({
  imports: [CanDatasourceModule],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}
