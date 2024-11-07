import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import multer = require('multer');

@Injectable({})
export class CloundinaryService {
  private _allowedImageExtension = [];
  private _allowedVideoExtension = [];

  public cloudinaryV2 = cloudinary;
  constructor(
    private configService: ConfigService
  ){
    const CLOUD_NAME = this.configService.get('CLOUDINARY_CLOUD_NAME'),
    API_KEY = this.configService.get('CLOUDINARY_API_KEY'),
    API_SECRET = this.configService.get('CLOUDINARY_API_SECRET')

    this.cloudinaryV2.config({ 
        cloud_name: CLOUD_NAME, 
        api_key: API_KEY, 
        api_secret: API_SECRET 
      });
  }
  
  public static getFilesStorage() {
    // Set File Storage Path
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, './');
      },
      filename: function(req, file, cb) {
        cb(null, file.originalname);
      },
    });
    return storage;
  }

  // public uploadFileToCloudinary(filePath:string){
  //   return new Promise((resolve, reject) =>{
  //       this.cloudinaryV2.uploader.upload(filePath, (error, result) =>{
  //           if(error) {
  //               reject(error) ;
  //           }
  //           resolve(result)
  //         });
  //   })
  // }

  public uploadFileToCloudinary(file , resourceType){
    return new Promise((resolve, reject) =>{
      cloudinary.uploader.upload_stream(resourceType, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(`Upload succeed: ${res}`);
          resolve(res);
        }
      }).end(file.buffer);
    })
  }
  public deleteFileFromCloudinary(name){
    return new Promise(async(resolve , reject) =>{
      try {      
       const result = await this.cloudinaryV2.uploader.destroy(name)
       resolve(result)
      } catch (error) {
        reject(error)
      }
    })
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
