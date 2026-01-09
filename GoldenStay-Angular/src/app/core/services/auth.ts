import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/users';

  currentUser = signal<User | null>(null);

  redirectUrl: string | null = null;

  constructor() {
    // 1. ALL'AVVIO: Controlliamo se c'è un utente salvato nel browser
    const utenteSalvato = localStorage.getItem('utente_loggato');
    if (utenteSalvato) {
      this.currentUser.set(JSON.parse(utenteSalvato));
      console.log('Utente ripristinato dalla memoria:', JSON.parse(utenteSalvato));
    }
  }

  // --- LOGIN ---
  login(email: string, pass: string) {
    const loginData = { email, password: pass };

    return this.http.post<User>(`${this.apiUrl}/login`, loginData).pipe(
      tap((userFound) => {
        console.log("Service: Login effettuato", userFound);

        // 2. SALVIAMO L'UTENTE: Aggiorniamo il segnale E la memoria del browser
        this.currentUser.set(userFound);
        localStorage.setItem('utente_loggato', JSON.stringify(userFound));
      })
    );
  }

  // --- REGISTRAZIONE ---
  register(name: string, email: string, pass: string) {
    const newUser: User = { name, email, password: pass };

    this.http.post<User>(`${this.apiUrl}/register`, newUser).subscribe({
      next: (savedUser) => {
        alert('Registrazione completata! Benvenuto ' + savedUser.name);

        // Anche qui, se la registrazione fa auto-login, salviamo tutto
        this.currentUser.set(savedUser);
        localStorage.setItem('utente_loggato', JSON.stringify(savedUser));

        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert('Errore durante la registrazione: ' + (err.error || 'Riprova.'));
      }
    });
  }

  // --- LOGOUT ---
  logout() {
    // 3. PULIZIA: Svuotiamo segnale e memoria
    this.currentUser.set(null);
    localStorage.removeItem('utente_loggato');
    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return !!this.currentUser();
  }
}
