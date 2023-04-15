import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common"
import { NestFactory, HttpAdapterHost, Reflector } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import { AppModule } from "./app.module"
import { ExceptionLoggerFilter } from "./utils/exceptionsLogger.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new ExceptionLoggerFilter(httpAdapter))
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
    })
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.use(cookieParser())
  await app.listen(3000)
}
bootstrap()
