import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importa le tue nuove classi (senza suffisso Component come hai scelto tu)
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  // Aggiungili qui nell'array imports:
  imports: [RouterOutlet, Navbar, Footer],
  // Definiamo il template direttamente qui o nel file HTML collegato
  template: `
    <div class="app-layout">
      <app-navbar></app-navbar> <main class="content">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer> </div>
  `,
  styleUrls: ['./app.css'] // O styles: [] se non usi il file css esterno
})
export class App {}
