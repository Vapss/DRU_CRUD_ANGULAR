import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { APP_CONFIG } from './app/core/config/app-config.token';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: environment.apiUrl } },
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
