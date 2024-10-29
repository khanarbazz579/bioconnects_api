import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class CanRedisService {
  private client;

  constructor(private configService: ConfigService) {
    // this.createRedisClient();
  }

  async createRedisClient() {
    this.client = createClient({
      password: this.configService.get('REDIS_PASSWORD'),
      socket: {
        host: this.configService.get('REDIS_HOST_URL'),
        port: this.configService.get('REDIS_PORT'),
      },
    });
    this.client.on('error', err => console.log('Redis Connect Error', err));
    await this.client.connect();
  }

  async get(key: string) {
    const data = await this.client.get(key);
    try {
      return JSON.parse(data);
    } catch (error) {
      console.log('Redis fetch error', error);
    }
  }

  /**
   * function to set redis key . Send expiry in days
   * @param key
   * @param value
   * @param expiry
   */
  set(key: string, value: any, expiry = 30) {
    if (expiry && isNaN(expiry)) {
      this.client.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24 * expiry);
    } else {
      this.client.set(key, JSON.stringify(value));
    }
  }

  async remove(key: string) {
    return await this.client.del(key);
  }

  async setPx(key: string, value: string, options: any) {
    return await this.client.set(key, value, options);
  }
}
