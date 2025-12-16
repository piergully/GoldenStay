import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hero-container">
      <div class="hero-overlay"></div>

      <div class="hero-wrapper">
        <h1>Trova il tuo soggiorno da sogno</h1>
        <p class="subtitle">Scopri suite esclusive e panorami mozzafiato</p>

        <div class="search-bar">

          <div class="input-group">
            <label>Check-in</label>
            <input type="date"
                   [(ngModel)]="checkIn"
                   (change)="validateDates()"
                   [min]="minDateToday">
          </div>

          <div class="input-group">
            <label>Check-out</label>
            <input type="date"
                   [(ngModel)]="checkOut"
                   [min]="checkIn">
          </div>

          <div class="input-group border-left">
            <label>Ospiti</label>
            <select [(ngModel)]="guests">
              <option [value]="1">1 Ospite</option>
              <option [value]="2">2 Ospiti</option>
              <option [value]="3">3 Ospiti</option>
              <option [value]="4">4 Ospiti</option>
            </select>
          </div>

          <button (click)="onSearch()">Cerca</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ... (I TUOI STILI PRECEDENTI RIMANGONO IDENTICI) ... */
    .hero-container {
      background-image: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
      background-size: cover; background-position: center; background-repeat: no-repeat;
      height: 500px; width: 100%; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; color: white;
    }
    .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 1; }
    .hero-wrapper { position: relative; z-index: 2; width: 100%; max-width: 900px; padding: 0 20px; }
    h1 { font-size: 3rem; margin-bottom: 10px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
    .subtitle { font-size: 1.3rem; margin-bottom: 40px; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
    .search-bar { background: white; padding: 15px 15px 15px 30px; border-radius: 50px; display: flex; align-items: center; gap: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.2); }
    .input-group { display: flex; flex-direction: column; flex: 1; text-align: left; }
    .border-left { border-left: 1px solid #ddd; padding-left: 15px; }
    label { font-size: 0.7rem; font-weight: 800; color: #2c3e50; text-transform: uppercase; margin-left: 5px; }
    input, select { border: none; background: transparent; font-size: 1rem; width: 100%; outline: none; color: #333; font-weight: 600; padding: 5px 0; cursor: pointer; }
    button { background-color: #d4af37; color: white; border: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
    button:hover { background-color: #b39028; transform: translateY(-3px); }
    @media (max-width: 768px) {
      .hero-container { height: auto; padding: 100px 0; }
      .search-bar { flex-direction: column; border-radius: 20px; padding: 25px; }
      .input-group { width: 100%; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; }
      .border-left { border-left: none; padding-left: 0; }
      button { width: 100%; }
    }
  `]
})
export class HeroSearchComponent {
  roomService = inject(RoomService);

  guests = 1;
  checkIn = '';
  checkOut = '';
  minDateToday = ''; // Variabile per impedire date passate

  constructor() {
    const today = new Date();
    this.minDateToday = this.formatDate(today); // Imposta il minimo a oggi

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.checkIn = this.formatDate(today);
    this.checkOut = this.formatDate(tomorrow);

    this.onSearch();
  }

  // LOGICA DI CONTROLLO DATE
  validateDates() {
    if (!this.checkIn) return;

    const inDate = new Date(this.checkIn);
    const outDate = new Date(this.checkOut);

    // Se Check-in è maggiore o uguale al Check-out...
    if (inDate >= outDate) {
      // ...spostiamo automaticamente il Check-out al giorno dopo il Check-in
      const nextDay = new Date(inDate);
      nextDay.setDate(nextDay.getDate() + 1);
      this.checkOut = this.formatDate(nextDay);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSearch() {
    // ULTERIORE SICUREZZA
    if (this.checkIn >= this.checkOut) {
      alert('La data di Check-out deve essere successiva al Check-in!');
      return;
    }
    this.roomService.updateSearch(this.guests, this.checkIn, this.checkOut);
  }
}
