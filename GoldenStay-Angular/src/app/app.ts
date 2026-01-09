import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <div class="app-layout">
      <app-navbar></app-navbar> <main class="content">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer> </div>
  `,
  styleUrls: ['./app.css']
})
export class App {}
