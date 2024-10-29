import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import { comparePassword } from '../../common/utils/bcrypt';
import { User } from '../user/user.model';
import * as moment from 'moment';
import { OtpService } from '../../common/services/otp/otp.service';
import {
  CanEmailNotificationService,
  CanNotificationService,
  CanSmsNotificationService,
} from '@can/notification';
import { SMS_API_CONFIG } from 'src/apis/config/sms.config';
import { ConfigService } from '@nestjs/config';
import { SmsService } from 'src/common/services/sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private emailService: CanEmailNotificationService,
    private otpService: OtpService,
    private smsService: SmsService,
    private notificationService: CanNotificationService,
    private configService: ConfigService,
  ) {}

  /**
   * Validate Email and Compare the Password
   *
   * @param email: string
   * @param password: string
   *
   * @return null | User
   */
  async validateEmailAndPassword(email: string, password: string) {
    // Validate User
    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      throw new ForbiddenException();
    }
    // Compare Password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new ForbiddenException();
    }
    // Return User Data
    return user;
  }

  /**
   * Validate Mobile and OTP
   *
   * @param mobile: string
   * @param otp: string
   *
   * @return null | User
   */
  async validateMobileAndOtp(mobile: string, otp: string) {
    // Validate User
    const user = await this.userService.findOne({
      where: {
        mobile,
        loginOtp: otp,
      },
    });
    if (!user) {
      throw new ForbiddenException();
    }
    // Validate Otp
    // if (!this.otpService.verifyOtp(otp)) {
    //   throw new ForbiddenException();
    // }
    // Reset OTP in DB
    await this.userService.updateById(user.id, {
      loginOtp: null,
    });
    // Return User Data
    return user;
  }

  /**
   *
   * @param email : string
   *
   * @return string
   */
  async getResetPasswordOtp(email: string): Promise<string> {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      throw new ForbiddenException();
    }
    const resetPasswordOtpExpiresIn = moment().add('minutes', 10).toISOString(); // 10 Min from Current Time
    const resetPasswordOtp = this.otpService.generateOtp();
    await this.userService.updateById(user.id, {
      resetPasswordOtpExpiresIn,
      resetPasswordOtp,
    });
    this.notificationService.sendNotification({
      category: 'Users',
      trigger: 'FORGOT_PASSWORD',
      data: {
        firstName: user.firstName,
        otp: resetPasswordOtp,
      },
      email: {
        to: [email],
      },
    });
    return resetPasswordOtp;
  }

  /**
   *
   * @param mobile : string
   *
   * @return string
   */
  async getMobileOtp(mobile: string): Promise<string> {
    const user = await this.userService.findOne({ where: { mobile } });
    if (!user) {
      throw new ForbiddenException();
    }
    const loginOtp = this.otpService.generateOtp();
    await this.userService.updateById(user.id, {
      loginOtp: '1234',
    });
    const message = `${1234} is your otp to login into Cantech!`;
    const smsApi = { ...SMS_API_CONFIG };
    smsApi['mobiles'] = mobile;
    // smsApi['message'] = message;
    //   this.smsService.sendSms({
    //   mobile: mobile,
    //   message: loginOtp,
    //   route: 'api',
    //   type: 'otp',
    // });
    // this.smsService.sendSms([
    //   {
    //     channel: 'api',
    //     message,
    //     mobile,
    //     api: smsApi,
    //     smsGateway:'msg91',
    //     type:'template',
    //     templateId:this.configService.get('OTP_TEMPLATE_ID')
    //   },
    // ]);
    return loginOtp;
  }

  /**
   *
   * @param token : string
   * @param password : string
   *
   * @return boolean
   */
  async resetPassword(email: string, otp: string, password: string) {
    const user = await this.userService.findOne({
      where: { email: email, resetPasswordOtp: otp },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    const { resetPasswordOtpExpiresIn } = user;

    if (moment(resetPasswordOtpExpiresIn).isBefore(moment())) {
      throw new ForbiddenException();
    }

    const isValid = this.otpService.verifyOtp(otp);

    if (!isValid) {
      throw new ForbiddenException();
    }

    this.notificationService.sendNotification({
      category: 'Users',
      trigger: 'RESET_PASSWORD_SUCCESSFUL',
      data: {
        firstName: user.firstName,
      },
      email: {
        to: [email],
      },
    });

    await this.userService.updateById(user.id, {
      password,
      resetPasswordOtpExpiresIn: null,
      resetPasswordOtp: null,
    });

    return true;
  }

  /**
   * Generate JWT Token with User Data
   *
   * @param user : UserDto
   *
   * @return string
   */
  async generateToken(user: User, expiresIn: number | string = '24h') {
    return this.jwtService.signAsync(_.pick(user, ['id', 'name', 'email']), {
      expiresIn,
    });
  }

  /**
   * Validate the JWT Token is Expired or Invalid Token
   *
   * @param token: string
   *
   * @return any
   */
  async validateToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  /**
   * Extract the Data from the Token
   *
   * @param token : string
   *
   * @return any
   */
  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
