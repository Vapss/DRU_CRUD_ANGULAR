import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    appConfig,
    provideRouter(APP_ROUTES),
  ],
});
