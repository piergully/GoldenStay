import { Routes } from '@angular/router';
// Assicurati che il percorso del guard sia corretto (usa il trucco CTRL+SPAZIO se serve)
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  //QUESTA è la parte pubblica

  // Home Page con la lista stanze
  {
    path: '',
    loadComponent: () => import('./features/room-list/room-list.component').then(m => m.RoomListComponent)
  },

  // Dettaglio Stanza
  {
    path: 'room/:id',
    loadComponent: () => import('./features/room-detail/room-detail').then(m => m.RoomDetail)
  },

  // Login e Registrazione
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },

  //PARTE PROTETTA

  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard] // <--- IL LUCCHETTO
  },
  {
    path: 'create-room',
    loadComponent: () => import('./features/admin/create-room/create-room').then(m => m.CreateRoomComponent),
    canActivate: [authGuard] // <--- IL LUCCHETTO
  },
  {
    path: 'admin/booking',
    loadComponent: () => import('./features/admin/admin-booking/admin-booking').then(m => m.AdminBookingsComponent),
    canActivate: [authGuard] // <--- IL LUCCHETTO
  },

  //  GESTIONE ERRORI
  // Se l'utente scrive un indirizzo a caso, lo riportiamo alla Home
  { path: '**', redirectTo: '' }
];
