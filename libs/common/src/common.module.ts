import { Module } from '@nestjs/common';
import { CanCommonService } from './common.service';
import { CanTextParserService } from './helpers/parser/text-parser.service';
import { CanPermissionModule } from './permissions/permissions.module';
import { CanExcelExportService } from './services/export-response/excel-export.service';
import { CanFileService } from './services/files/file.service';
import { CanCsvParserService } from './services/parser/csv-parser.service';
import { DataStashService } from './services/data-stash/data-stash.service';
import { HttpModule } from '@nestjs/axios';
import { QueryModule } from 'src/core/query/query.module';
import { CloundinaryService } from './services/cloudinary/cloudinary.service';

@Module({
  providers: [
    CanCommonService,
    CanTextParserService,
    CanCsvParserService,
    CanFileService,
    CanExcelExportService,
    DataStashService,
    CloundinaryService,
  ],
  exports: [
    CanCommonService,
    CanPermissionModule,
    CanTextParserService,
    CanCsvParserService,
    CanFileService,
    DataStashService,
    CloundinaryService,
  ],
  imports: [CanPermissionModule, HttpModule, QueryModule],
})
export class CanCommonModule {}
