import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiService } from '../services/api/api.service';
@Injectable({})
export class CronService {
  constructor(
    private apiService: ApiService
  ) {}

  // @Cron(CronExpression.EVERY_5_MINUTES)
  async restartApp(){
  const options = {
    'method': 'GET',
    'url': 'https://biotech-connects-api.onrender.com/v1/blogs/5',
    'headers': { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFyYmF6IGtoYW4iLCJlbWFpbCI6ImtoYW5hcmJheno1NzlAZ21haWwuY29tIiwiaWF0IjoxNzMyMDE3MDgyLCJleHAiOjE3MzIxMDM0ODJ9.e58ulAi6DYJ3qTBcrRDuJ6btujmE_SM5UZtbuVoLog8'
    }
  };
  const blogs = await this.apiService.request(options);
  console.log("BLOGS :::::", blogs);
  

  }
}
