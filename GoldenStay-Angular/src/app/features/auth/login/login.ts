import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-container">
      <h2>Bentornato</h2>
      <p class="subtitle">Accedi per gestire le tue prenotazioni</p>

      <form (ngSubmit)="onLogin()">
        @if (errorMessage) {
          <div class="error-banner">{{ errorMessage }}</div>
        }

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required placeholder="demo@test.com">
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required placeholder="******">
        </div>

        <button type="submit">Accedi</button>
      </form>

      <p class="footer-text">Non hai un account? <a routerLink="/register">Registrati qui</a></p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 60px auto; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; }
    h2 { margin-bottom: 10px; color: #2c3e50; }
    .subtitle { color: #888; margin-bottom: 30px; }
    .error-banner { background: #fee; color: #c0392b; padding: 10px; border-radius: 4px; margin-bottom: 20px; font-size: 0.9rem; border: 1px solid #f5c6cb; }
    .form-group { text-align: left; margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; font-weight: bold; color: #2c3e50; }
    input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
    button { width: 100%; padding: 14px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; transition: 0.3s; }
    button:hover { background: #d4af37; }
    .footer-text { margin-top: 20px; }
    a { color: #d4af37; text-decoration: none; font-weight: bold; }
  `]
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  onLogin() {
    this.errorMessage = '';

    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe({

        next: (utenteRicevuto: any) => {
          console.log("DATI UTENTE:", utenteRicevuto);

          // Controllo sicuro del ruolo
          const ruolo = utenteRicevuto.role ? utenteRicevuto.role.trim().toUpperCase() : '';

          if (ruolo === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        },

        error: (errore) => {
          console.error("Errore login:", errore);
          this.errorMessage = 'Email o password sbagliata!';
        }
      });
    } else {
      this.errorMessage = 'Compila tutti i campi.';
    }
  }
}
