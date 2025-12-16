import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. AGGIUNGI QUESTO IMPORT
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 2. AGGIUNGI QUESTA FUNZIONE NELL'ARRAY
    provideHttpClient()
  ]
};
