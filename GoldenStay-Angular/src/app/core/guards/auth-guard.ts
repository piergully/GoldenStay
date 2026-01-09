import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // <--- Controlla che questo percorso sia giusto!

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se l'utente è loggato (cioè isLoggedIn è true), apri la porta
  if (authService.isLoggedIn) {
    return true;
  }

  // Altrimenti, LOGIN
  return router.createUrlTree(['/login']);
};
