import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Serve per usare @if
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth'; // Importiamo il cervello

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
          <li><a routerLink="/">Home</a></li>

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
      position: sticky; /* Fa restare la navbar in alto */
      top: 0;
      z-index: 1000;
    }
    .logo { font-size: 1.5rem; font-weight: bold; cursor: pointer; }
    .golden { color: #d4af37; }
    ul { list-style: none; display: flex; align-items: center; gap: 20px; margin: 0; padding: 0; }

    a { text-decoration: none; color: white; transition: color 0.3s; font-size: 0.95rem; }
    a:hover { color: #d4af37; }

    /* Stili specifici per i bottoni Auth */
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
    .btn-logout:hover { color: #e74c3c; } /* Rosso quando passi sopra logout */
  `]
})
export class Navbar {
  // Iniettiamo il servizio e lo rendiamo PUBLIC così l'HTML può leggerlo
  public authService = inject(AuthService);
}
