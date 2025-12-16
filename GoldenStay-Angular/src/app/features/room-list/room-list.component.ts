import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../core/services/room.service';
import { BookingCalculator } from '../../core/services/booking-calculator'; // Importa il calculator
import { HeroSearchComponent } from '../hero-search/hero-search';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSearchComponent],
  template: `
    <app-hero-search></app-hero-search>

    <div class="container">
      <h2>Le nostre Stanze</h2>

      <div class="grid">
        @for (room of roomService.filteredRooms(); track room.id) {
          <div class="card">
            <img [src]="room.imageUrl" [alt]="room.title">
            <div class="card-content">
              <h3>{{ room.title }}</h3>
              <p class="desc">{{ room.description }}</p>

              <div class="info-row">
                <span class="capacity">👥 {{ room.capacity }} Ospiti</span>
              </div>

              <div class="price-section">
                @if (hasDatesSelected()) {
                  <div class="price total-price">
                    {{ getDynamicPrice(room) | currency:'EUR' }}
                  </div>
                  <small class="price-label">
                    Prezzo totale per <strong>{{ getNights() }} notti</strong>
                    <br>
                    <span class="tariff-tag">{{ getTariffName(room) }}</span>
                  </small>
                }
                @else {
                  <div class="price">
                    {{ room.pricePerNight | currency:'EUR' }} <small>/ notte</small>
                  </div>
                }
              </div>

              <button [routerLink]="['/room', room.id]">Dettagli</button>
            </div>
          </div>
        }

        @if (roomService.filteredRooms().length === 0) {
          <div class="no-results">
            <p>😔 Nessuna stanza disponibile per questi filtri.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
    h2 { font-size: 2rem; color: #2c3e50; margin-bottom: 30px; border-left: 5px solid #d4af37; padding-left: 15px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
    .card { border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: white; transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
    .card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    img { width: 100%; height: 200px; object-fit: cover; }
    .card-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
    h3 { margin: 0 0 10px 0; color: #2c3e50; font-size: 1.2rem; }
    .desc { color: #666; font-size: 0.9rem; line-height: 1.5; margin-bottom: 15px; flex: 1; }
    .info-row { margin-bottom: 15px; font-size: 0.85rem; color: #888; font-weight: bold; }

    /* Stili Prezzi */
    .price-section { margin-bottom: 15px; min-height: 60px; }
    .price { font-weight: bold; color: #2c3e50; font-size: 1.3rem; }
    .total-price { color: #d4af37; font-size: 1.5rem; } /* Oro se è il totale */
    .price-label { font-size: 0.85rem; color: #666; line-height: 1.4; display: block; margin-top: 5px; }
    .tariff-tag { font-size: 0.75rem; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; color: #555; }

    button { width: 100%; padding: 12px; background-color: white; color: #2c3e50; border: 1px solid #2c3e50; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; margin-top: auto; }
    button:hover { background-color: #2c3e50; color: white; }
    .no-results { grid-column: 1 / -1; text-align: center; padding: 50px; background: #f9f9f9; border-radius: 8px; color: #7f8c8d; font-size: 1.2rem; }
  `]
})
export class RoomListComponent {
  roomService = inject(RoomService);
  calculator = inject(BookingCalculator);

  // Helper per sapere se ci sono date valide
  hasDatesSelected(): boolean {
    const c = this.roomService.searchCriteria();
    return !!(c.checkIn && c.checkOut);
  }

  // Calcola il prezzo totale per la lista
  getDynamicPrice(room: Room): number {
    const c = this.roomService.searchCriteria();
    if (!c.checkIn || !c.checkOut) return room.pricePerNight;

    const strategy = this.calculator.getBestStrategy(c.checkIn, c.checkOut);
    return this.calculator.calculateTotal(strategy, room.pricePerNight, c.checkIn, c.checkOut);
  }

  // Recupera il nome della tariffa (es. "Sconto Soggiorno Lungo")
  getTariffName(room: Room): string {
    const c = this.roomService.searchCriteria();
    if (!c.checkIn || !c.checkOut) return '';
    const strategy = this.calculator.getBestStrategy(c.checkIn, c.checkOut);
    return strategy.getName();
  }

  // Conta le notti per mostrarle nel testo
  getNights(): number {
    const c = this.roomService.searchCriteria();
    if (!c.checkIn || !c.checkOut) return 0;
    const start = new Date(c.checkIn).getTime();
    const end = new Date(c.checkOut).getTime();
    return Math.ceil((end - start) / (1000 * 3600 * 24));
  }
}
