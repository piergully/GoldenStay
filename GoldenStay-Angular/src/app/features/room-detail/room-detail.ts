import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../core/services/room.service';
import { AuthService } from '../../core/services/auth'; // Assicurati sia auth.service
import { BookingCalculator } from '../../core/services/booking-calculator'; // Usa il Service corretto
import { StandardPricingStrategy } from '../../core/strategies/price.strategy';
import { Room } from '../../core/models/room.model';

// 1. IMPORTA IL COMPONENTE CORRETTO
import { PaymentModal } from '../payment-modal/payment-modal';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  // 2. AGGIUNGILO AGLI IMPORTS
  imports: [CommonModule, RouterLink, PaymentModal],
  template: `
    <div class="detail-container" *ngIf="room; else notFound">

      <div class="image-header">
        <img [src]="room.imageUrl" [alt]="room.title">
      </div>

      <div class="content-grid">

        <div class="info-section">
          <button routerLink="/" class="back-btn">← Torna alla lista</button>
          <h1>{{ room.title }}</h1>

          <div class="base-price-tag">
            Prezzo base: <strong>{{ room.pricePerNight | currency:'EUR' }}</strong> / notte
          </div>

          <p class="desc">{{ room.description }}</p>

          <h3>Servizi inclusi</h3>
          <ul class="services-list">
            <li>Wi-Fi Gratuito</li>
            <li>Colazione inclusa</li>
            <li>Servizio in camera</li>
            <li>Cancellazione gratuita</li>
          </ul>
        </div>

        <div class="booking-section">
          <div class="booking-card">

            <h3 style="margin-top: 0;">Il tuo preventivo</h3>

            <div class="calculation-box" *ngIf="totalPrice > 0">
              <div class="row">
                <span>Date:</span>
                <span>{{ nights }} notti</span>
              </div>
              <div class="row">
                <span>Tariffa:</span>
                <span class="tariff-name">{{ appliedTariff }}</span>
              </div>

              <hr>

              <div class="total-section">
                <span>Totale Soggiorno:</span>

                <div class="price-stack">
                  @if (totalPrice < originalPrice) {
                    <span class="old-price">{{ originalPrice | currency:'EUR' }}</span>
                  }

                  <span class="big-total">{{ totalPrice | currency:'EUR' }}</span>
                </div>
              </div>

            </div>

            <button class="btn-book" (click)="onBook()">
              Prenota Ora
            </button>

            <p class="note">Nessun addebito immediato.</p>
          </div>
        </div>

      </div>
    </div>

    @if (showModal && room) {
      <app-payment-modal
        [room]="room"
        [totalPrice]="totalPrice"
        [guestName]="authService.currentUser()?.name || 'Ospite'"
        [checkIn]="currentCheckIn"
        [checkOut]="currentCheckOut"
        (close)="showModal = false">
      </app-payment-modal>
    }

    <ng-template #notFound>
      <div class="error"><h2>Stanza non trovata!</h2><button routerLink="/">Torna alla Home</button></div>
    </ng-template>
  `,
  styles: [`
    .detail-container { max-width: 1000px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .image-header img { width: 100%; height: 350px; object-fit: cover; }
    .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; padding: 2rem; }
    @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } }

    .back-btn { background: none; border: none; color: #666; cursor: pointer; margin-bottom: 1rem; text-decoration: underline; }
    h1 { margin: 0 0 10px 0; color: #2c3e50; }
    .base-price-tag { display: inline-block; background: #f0f4f8; color: #2c3e50; padding: 5px 10px; border-radius: 4px; margin-bottom: 20px; font-size: 0.95rem; }
    .desc { color: #555; line-height: 1.6; }
    .services-list { padding-left: 20px; color: #555; line-height: 1.8; }

    .booking-card { background: #fffdf5; padding: 25px; border: 1px solid #d4af37; border-radius: 12px; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.1); position: sticky; top: 20px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem; color: #555; }
    .tariff-name { font-weight: bold; color: #2c3e50; font-size: 0.85rem; }
    hr { border: 0; border-top: 1px solid #eee; margin: 15px 0; }

    .total-section { display: flex; justify-content: space-between; align-items: center; }
    .total-section > span { font-weight: bold; font-size: 1.1rem; color: #555; }
    .price-stack { display: flex; flex-direction: column; align-items: flex-end; }
    .old-price { text-decoration: line-through; color: #999; font-size: 0.9rem; margin-bottom: -5px; }
    .big-total { font-size: 1.8rem; font-weight: bold; color: #d4af37; }

    .btn-book { width: 100%; padding: 15px; background-color: #d4af37; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 1.2rem; margin-top: 20px; }
    .btn-book:hover { background-color: #b39028; }
    .note { font-size: 0.75rem; color: #999; margin-top: 10px; text-align: center; }
    .error { text-align: center; padding: 50px; }
  `]
})
export class RoomDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  // Rendiamo authService PUBLIC così possiamo usarlo nel template HTML
  public authService = inject(AuthService);
  private calculator = inject(BookingCalculator);

  room: Room | undefined;
  totalPrice = 0;
  originalPrice = 0;
  appliedTariff = '';
  nights = 0;

  // 4. NUOVE VARIABILI PER IL MODALE
  showModal = false;
  currentCheckIn = '';
  currentCheckOut = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.room = this.roomService.getRoomById(id);
      this.calculatePreview();
    }
  }

  calculatePreview() {
    const criteria = this.roomService.searchCriteria();
    let checkIn = criteria.checkIn;
    let checkOut = criteria.checkOut;

    if (!checkIn || !checkOut) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkIn = this.formatDate(today);
      checkOut = this.formatDate(tomorrow);
    }

    if (this.room && checkIn && checkOut) {
      // 5. SALVIAMO LE DATE PER IL MODALE
      this.currentCheckIn = checkIn;
      this.currentCheckOut = checkOut;

      const bestStrategy = this.calculator.getBestStrategy(checkIn, checkOut);
      this.totalPrice = this.calculator.calculateTotal(bestStrategy, this.room.pricePerNight, checkIn, checkOut);
      this.appliedTariff = bestStrategy.getName();

      const standardStrategy = new StandardPricingStrategy();
      this.originalPrice = this.calculator.calculateTotal(standardStrategy, this.room.pricePerNight, checkIn, checkOut);

      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();
      this.nights = Math.ceil((end - start) / (1000 * 3600 * 24));
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onBook() {
    if (this.authService.isLoggedIn) {
      // Se loggato -> Apre il modale
      this.showModal = true;
    } else {
      // Se NON loggato ->

      // 1. Salviamo l'URL corrente (es. '/room/1') nel servizio
      this.authService.redirectUrl = this.router.url;

      // 2. Poi lo mandiamo a registrarsi (o login)
      this.router.navigate(['/login']); // Meglio mandarlo al login, da lì può andare al register se vuole
    }
  }
}
