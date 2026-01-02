import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/room-list/room-list.component').then(m => m.RoomListComponent) }, // Nota: assicurati che il nome file sia corretto
  { path: 'room/:id', loadComponent: () => import('./features/room-detail/room-detail').then(m => m.RoomDetail) },

  // NUOVE ROTTE AUTH
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  {
    path: 'room/:id',
    loadComponent: () => import('./features/room-detail/room-detail').then(m => m.RoomDetail),
    // QUESTO buttafuori!
    canActivate: [authGuard]
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'create-room',
    loadComponent: () => import('./features/admin/create-room/create-room').then(m => m.CreateRoomComponent),
  },
  {
    path: 'admin/booking',
    loadComponent: () => import('./features/admin/admin-booking/admin-booking').then(m => m.AdminBookingsComponent)
  },
  { path: '**', redirectTo: '' }
];
