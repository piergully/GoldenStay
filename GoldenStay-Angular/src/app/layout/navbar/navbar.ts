import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="navbar">
      <div class="logo" routerLink="/">
        <span class="golden">Golden</span>Stay
      </div>

      <nav>
        <ul>

          @if (isClientPage) {
            <li><a routerLink="/">Home</a></li>
          }

          @if (authService.currentUser()) {

            <li class="user-welcome">
              Ciao, {{ authService.currentUser()?.name }}!
            </li>

            <li>
              <button class="btn-logout" (click)="authService.logout()">Esci</button>
            </li>

          }

          @else {

            <li><a routerLink="/login">Accedi</a></li>
            <li><a routerLink="/register" class="btn-register">Registrati</a></li>

          }
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #2c3e50;
      color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .logo { font-size: 1.5rem; font-weight: bold; cursor: pointer; }
    .golden { color: #d4af37; }
    ul { list-style: none; display: flex; align-items: center; gap: 20px; margin: 0; padding: 0; }

    a { text-decoration: none; color: white; transition: color 0.3s; font-size: 0.95rem; }
    a:hover { color: #d4af37; }

    .user-welcome { color: #d4af37; font-weight: bold; border-right: 1px solid #555; padding-right: 20px; }

    .btn-register {
      border: 1px solid #d4af37;
      padding: 8px 18px;
      border-radius: 20px;
      color: #d4af37 !important;
      transition: 0.3s;
    }
    .btn-register:hover {
      background: #d4af37;
      color: white !important;
    }

    .btn-logout {
      background: none;
      border: none;
      color: #bbb;
      cursor: pointer;
      font-size: 0.95rem;
      text-decoration: underline;
    }
    .btn-logout:hover { color: #e74c3c; }
  `]
})
export class Navbar {
  public authService = inject(AuthService);
  private router = inject(Router);

  // Variabile che decide se mostrare il tasto Home
  isClientPage: boolean = true;

  constructor() {
    // Ci mettiamo in ascolto dei cambi di pagina
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Se l'URL contiene '/admin', allora NON siamo nella pagina cliente
        this.isClientPage = !event.url.includes('/admin');
      }
    });
  }
}
