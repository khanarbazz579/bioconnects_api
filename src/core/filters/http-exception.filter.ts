import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    try {
      const exceptionResponse: any = exception.getResponse();
      const status = exception.getStatus();
      response.status(status).json({
        ...exceptionResponse,
      });
    } catch (error) {
      response.status(500).json({
        statusCode: 500,
        data: null,
        message: 'Internal Server Error',
        fieldErrors: ['Internal Server Error'],
        error: true,
      });
    }
  }
}
