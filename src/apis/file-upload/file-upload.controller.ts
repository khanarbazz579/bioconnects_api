import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  Req,
  Request,
} from '@nestjs/common';
import { FileUploadDto } from './file-upload.dto';
import { FileUploadService } from './file-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async create(@UploadedFiles() files, @Req() request?: Request) {
    return this.fileUploadService.processFileUpload(files, request);
  }

  @Post('upload-media')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMedia(@UploadedFiles() files, @Req() request?: Request) {
    return this.fileUploadService.uploadMedia(files, request);
  }

  @Post('delete')
  @HttpCode(200)
  async delete(@Body(ValidationPipe) fileUploadDto: FileUploadDto) {
    return this.fileUploadService.deleteFromS3(fileUploadDto);
  }
}
