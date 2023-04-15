import { ArgumentsHost, Catch } from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"

@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    console.log("Exception throw", exception)
    super.catch(exception, host)
  }
}
