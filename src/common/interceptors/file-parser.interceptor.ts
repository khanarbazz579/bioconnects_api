import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { CanContextService } from '@can/common';
import { CanAwsService } from '@can/aws';
const crypto = require('crypto');

@Injectable()
export class FileParserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    if (
      (request && !request['files']) ||
      (request && request['files'] && request['files'].length != 1) ||
      !(request['files'][0]['mimetype'] === 'text/csv') ||
      !request['files'][0]['buffer'].toString().trim()
    ) {
      throw new BadRequestException('Invalid file input');
    }
    if (
      request &&
      !request['files'] &&
      request['files'][0]['mimetype'] === 'text/csv' &&
      request['files'][0]['size'] > 10485760
    ) {
      throw new BadRequestException('CSV file cannot be larger than 10 MB');
    }
    const awsService = CanContextService.getAppContext().get(CanAwsService);
    const configService = CanContextService.getAppContext().get(ConfigService);
    // Set Upload Params
    const uploadParams: any = {
      Bucket: configService.get('AWS_S3_BUCKET_NAME'),
      Key: Date.now() + '_' + request['files'][0]['originalname'],
      Body: request['files'][0]['buffer'],
      ContentType: request['files'][0]['mimetype'],
      ACL: 'public-read',
    };

    // Uploading to S3
    const s3 = await awsService.getS3Object({
      profile: configService.get('AWS_PROFILE'),
      region: configService.get('AWS_REGION'),
    });
    const resp = await awsService.uploadToS3(uploadParams, s3);
    const data = await awsService.getObject(
      {
        Bucket: configService.get('AWS_S3_BUCKET_NAME'),
        Key: resp.Key,
      } as any,
      s3,
    );
    const hashedFileName = crypto
      .createHash('md5')
      .update(new Uint8Array(request['files'][0]['buffer']))
      .digest('hex');
    if (!data || data.length === 0)
      throw new BadRequestException('file data required!');
    request['body']['csv'] = {
      url: resp.Location,
      data: data,
      filename: request['files'][0]['originalname'],
      Key: uploadParams.Key,
      userEmail: request['user']['email'],
      hashedFileName: hashedFileName,
    };

    // Return Response
    return next.handle();
  }
}
