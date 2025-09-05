import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';

bootstrapApplication(null!, {
  providers: [
    appConfig,
    provideRouter(APP_ROUTES),
  ],
});
