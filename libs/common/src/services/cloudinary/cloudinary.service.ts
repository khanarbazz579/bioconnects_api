import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable({})
export class CloundinaryService {
  private _allowedImageExtension = [];
  private _allowedVideoExtension = [];

  constructor(private _configService: ConfigService) {
    cloudinary.config({
      api_key: this._configService.get('CLOUDINARY_API_KEY'),
      api_secret: this._configService.get('CLOUDINARY_API_SECRET'),
      cloud_name: this._configService.get('CLOUDINARY_CLOUD_NAME'),
      secure: true,
    });

    //console.log(this._configService.get('CLOUDINARY_ALLOWED_IMAGE_EXTENSIONS'));
    //console.log(
      // typeof this._configService.get('CLOUDINARY_ALLOWED_VIDEO_EXTENSIONS'),
    // );

    this._allowedImageExtension = JSON.parse(
      this._configService.get('CLOUDINARY_ALLOWED_IMAGE_EXTENSIONS'),
    );
    this._allowedVideoExtension = JSON.parse(
      this._configService.get('CLOUDINARY_ALLOWED_VIDEO_EXTENSIONS'),
    );
  }

  async uploadViaPath(path: string) {
    try {
      let resourceType: 'image' | 'video' = 'image';
      if (this._allowedVideoExtension.includes(path.split('.').pop())) {
        resourceType = 'video';
      }
      const uploadResult = await cloudinary.uploader.upload_large(path, {
        allowed_formats: [
          ...this._allowedImageExtension,
          ...this._allowedVideoExtension,
        ],
        resource_type: resourceType,
      });
      return {
        originalUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadViaBuffer(buffer: any, name: string) {
    try {
      let resourceType: 'image' | 'video' = 'image';
      if (this._allowedVideoExtension.includes(name.split('.').pop())) {
        resourceType = 'video';
      }
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              allowed_formats: [
                ...this._allowedImageExtension,
                ...this._allowedVideoExtension,
              ],
              resource_type: resourceType,
            },
            (error, uploadResult) => {
              if (error) {
                reject(error);
              }
              return resolve({
                originalUrl: uploadResult.secure_url,
                publicId: uploadResult.public_id,
              });
            },
          )
          .end(buffer);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async cloudnarySearch(){
    try{
      const searchImage = await cloudinary.search.max_results(500).execute();
      return searchImage;
    }
    catch(error){
      //console.log();
      
    }
    
  }
}
