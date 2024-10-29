import { CanAwsService } from '@can/aws';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadDto } from './file-upload.dto';
import { CloundinaryService } from '@can/common/services/cloudinary/cloudinary.service';
var fs = require('fs');
var jsZip = require('jszip');
var unzipper = require('unzipper');
const fsPromises = fs.promises;
const exec = require('child_process').exec;
const path = require('path');
const crypto = require('crypto');
@Injectable()
export class FileUploadService {
  // Set S3 Bucket Name
  private BUCKET_NAME;
  constructor(
    private awsService: CanAwsService,
    private configService: ConfigService,
    private _cloundinaryService: CloundinaryService,
  ) {
    this.BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  async processFileUpload(files: any, request) {
    if (files && Array.isArray(files)) {
      files.forEach(file => {
        if (file['mimetype'] === 'text/csv' && file['size'] > 10485760) {
          throw new BadRequestException('CSV file cannot be larger than 10 MB');
        }
      });
    }
    if (!(files && files[0] && files[0]['originalname'])) {
      throw new BadRequestException('Invalid file');
    }
    if (
      request &&
      request.query &&
      request.query.unzip &&
      (request.query.unzip == 'true' || request.query.unzip == true)
    ) {
      if (path.parse(files[0]['originalname']).ext == '.zip') {
        return await this.uploadZipFileToS3(files);
      } else {
        throw new BadRequestException('Invalid zip file');
      }
    } else {
      return this.uploadFileToS3(files);
    }
  }

  async uploadMedia(files: any, request: any) {
    try {
      const uploadResponse = await this._cloundinaryService.uploadViaBuffer(
        files[0].buffer,
        files[0].originalname,
      );
      //console.log(uploadResponse);
      return uploadResponse;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  readFile(filepath) {
    return new Promise((resolve, reject) => {
      var stream = fs.createReadStream(filepath + '.zip');
      stream.pipe(
        unzipper.Extract({ path: filepath }).on('close', function () {
          // Your callback code will go here...
          return resolve(filepath);
        }),
      );
    });
  }
  async writeFile(files, path) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path + '.zip', files[0].buffer, err => {
        if (err) throw err;
        return resolve(true);
      });
    });
  }
  async uploadZipFileToS3(files) {
    let result = [];
    const path = new Date().getTime().toString();
    try {
      let writeFile = await this.writeFile(files, path);
      let res = await this.readFile(path);
      //console.log(res, writeFile);
      let fileData;
      fileData = await fsPromises.readdir(path, async (err, files) => {
        if (err) {
          return //console.log('Error: ' + err);
        }
      });

      if (!fileData) {
        throw new BadRequestException('invalid file');
      }
      let data = [];
      for (let i = 0; i < fileData.length; i++) {
        let obj = {};
        try {
          obj['originalname'] = fileData[i];
          obj['buffer'] = fs.readFileSync(path + '/' + fileData[i]);
          data.push(obj);
        } catch (e) {
          //console.log(path + '/' + fileData[i] + " file does't exists");
        }
      }
      if (data.length > 0) {
        result = await this.uploadFileToS3(data);
      }
    } catch (e) {
      // command to delete file and folder
      exec('rm -Rf ' + path + ' ' + 'rm -r ' + path + '*', () => {});
      throw new BadRequestException('Invalid file');
    }
    // command to delete file and folder
    exec('rm -Rf ' + path + ' ' + 'rm -r ' + path + '*', () => {});
    return result;
  }

  async readExportedJson(file: File): Promise<Blob> {
    const zipper = new jsZip();
    const unzippedFiles = await zipper.loadAsync(file);
    return Promise.resolve(unzippedFiles)
      .then(unzipped => {
        if (!Object.keys(unzipped.files).length) {
          return Promise.reject('No file was found');
        }
        return unzipped.files[Object.keys(unzipped.files)[0]];
      })
      .then(unzippedFile => zipper.file(unzippedFile.name).async('string'));
  }

  public async uploadFileToS3(files: any): Promise<any> {
    return new Promise(async resolve => {
      // Store Upload Response
      const uploadedResponse: any = [];
      // Uplod Count
      let count = 0;
      // Uploading Files
      files.forEach(async (file: any) => {
        // Set Upload Params
        const uploadParams: any = {
          Bucket: this.BUCKET_NAME,
          Key: Date.now() + '_' + file['originalname'],
          Body: file['buffer'],
          ACL: 'public-read',
          ContentType: file['mimetype'],
        };

        if (file['mimetype'] === 'application/pdf') {
          uploadParams['ContentType'] = 'application/pdf';
          uploadParams['ContentDisposition'] = 'inline';
        }
        const hashedFileName = crypto
          .createHash('md5')
          .update(new Uint8Array(file['buffer']))
          .digest('hex');
        // Uploading to S3
        const resp = await this.awsService.uploadToS3(uploadParams);

        // Store Response
        uploadedResponse.push({
          name: resp.Key,
          path: resp.Location,
          file_name: file['originalname'],
          hashedFileName: hashedFileName,
        });
        // Increment Upload Count
        count++;
        // Resolve Promise
        if (count === files.length) {
          resolve({ files: uploadedResponse });
        }
      });
    });
  }

  public async uploadFileToS3Key(files: any): Promise<any> {
    return new Promise(async resolve => {
      // Store Upload Response
      const uploadedResponse: any = [];
      // Uplod Count
      let count = 0;
      // Uploading Files
      files.forEach(async (file: any) => {
        // Set Upload Params
        const uploadParams: any = {
          Bucket: this.BUCKET_NAME,
          Key:  file['key'],
          Body: file['buffer'],
          ACL: 'public-read',
          ContentType: file['mimetype'],
        };

        if (file['mimetype'] === 'application/pdf') {
          uploadParams['ContentType'] = 'application/pdf';
          uploadParams['ContentDisposition'] = 'inline';
        }
        if (file['mimetype'] === 'application/zip') {
          uploadParams['ContentType'] = 'application/zip';
        }

        // Uploading to S3
        const resp = await this.awsService.uploadToS3(uploadParams);

        // Store Response
        uploadedResponse.push({
          name: resp.Key,
          path: resp.Location,
          file_name: file['originalname']
        });
        // Increment Upload Count
        count++;
        // Resolve Promise
        if (count === files.length) {
          resolve({ files: uploadedResponse });
        }
      });
    });
  }

  public async deleteFromS3(fileUploadDto: FileUploadDto): Promise<any> {
    return new Promise(resolve => {
      // Store Delete Response
      const deletedResponse: any = [];
      // delete Count
      let count = 0;
      fileUploadDto.paths.forEach(async path => {
        const splittedPath = path.split('/');
        const key = splittedPath[splittedPath.length - 1].replace(
          new RegExp(/%20/gim),
          ' ',
        );
        await this.awsService.deleteFromS3({
          Bucket: this.BUCKET_NAME,
          Key: key,
        });
        // Store Response
        deletedResponse.push(key);
        // Increment Upload Count
        count++;
        // Resolve Promise
        if (count === fileUploadDto.paths.length) {
          resolve({ files: deletedResponse });
        }
      });
    });
  }
}
