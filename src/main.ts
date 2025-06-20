import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers!,
    provideHttpClient(withInterceptors([])),
  ],
})
  .catch((err) => console.error(err));
