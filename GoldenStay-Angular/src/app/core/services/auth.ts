import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // 1. Importa HTTP

// Interfaccia User (deve combaciare con quella Java)
export interface User {
  id?: number; // Opzionale perché in creazione non c'è ancora
  name?: string;
  email: string;
  password?: string; // Lo mandiamo solo al server
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient); // 2. Inietta HTTP

  private apiUrl = 'http://localhost:8080/api/users'; // URL Backend

  currentUser = signal<User | null>(null);
  redirectUrl: string | null = null;

  constructor() {}

  // --- REGISTRAZIONE VERA ---
  register(name: string, email: string, pass: string) {
    const newUser: User = { name, email, password: pass };

    // Chiamata POST al Backend
    this.http.post<User>(`${this.apiUrl}/register`, newUser).subscribe({
      next: (savedUser) => {
        alert('Registrazione completata! Benvenuto ' + savedUser.name);
        this.currentUser.set(savedUser);
        this.handleRedirect();
      },
      error: (err) => {
        console.error(err);
        alert('Errore: ' + (err.error || 'Registrazione fallita'));
      }
    });
  }

  // --- LOGIN VERO ---
  // Nota: Ora non ritorna boolean immediato (perché è asincrono),
  // quindi gestiamo tutto qui dentro o useremmo Observable.
  // Per semplicità manteniamo la logica void e usiamo alert.
  login(email: string, pass: string) {
    const loginData = { email, password: pass };

    this.http.post<User>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (userFound) => {
        // Successo!
        this.currentUser.set(userFound);
        this.handleRedirect();
      },
      error: (err) => {
        // Errore
        alert('Login fallito! Controlla email e password.');
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

  private handleRedirect() {
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
      this.redirectUrl = null;
    } else {
      this.router.navigate(['/']);
    }
  }
}
