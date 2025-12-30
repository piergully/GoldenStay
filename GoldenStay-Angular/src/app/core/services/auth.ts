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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users';

  currentUser = signal<User | null>(null);

  // Questa variabile serve per non far rompere room-detail
  redirectUrl: string | null = null;

  constructor() {}

  // --- 1. LOGIN (Restituisce Observable) ---
  // Questo serve al Login.ts per decidere se andare in Dashboard o Home
  login(email: string, pass: string) {
    const loginData = { email, password: pass };

    return this.http.post<User>(`${this.apiUrl}/login`, loginData).pipe(
      tap((userFound) => {
        console.log("Service: Login effettuato", userFound);
        this.currentUser.set(userFound);
      })
    );
  }

  // --- 2. REGISTRAZIONE (Gestisce la subscribe internamente) ---
  // Questo lo rimettiamo come prima così la pagina di registrazione torna a funzionare!
  register(name: string, email: string, pass: string) {
    const newUser: User = { name, email, password: pass };

    this.http.post<User>(`${this.apiUrl}/register`, newUser).subscribe({
      next: (savedUser) => {
        alert('Registrazione completata! Benvenuto ' + savedUser.name);
        this.currentUser.set(savedUser);
        this.router.navigate(['/home']); // O dove vuoi mandarlo
      },
      error: (err) => {
        console.error(err);
        alert('Errore durante la registrazione: ' + (err.error || 'Riprova.'));
      }
    });
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return !!this.currentUser();
  }
}
