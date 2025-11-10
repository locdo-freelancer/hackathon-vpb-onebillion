import { Provider } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { ResponseLoggingInterceptor } from "../../../libs/interceptors/src/response-logging.interceptor";

export const APP_PROVIDERS: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseLoggingInterceptor,
  },
];
