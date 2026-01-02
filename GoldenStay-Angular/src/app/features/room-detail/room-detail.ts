import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Services
import { RoomService } from '../../core/services/room.service';
import { AuthService } from '../../core/services/auth'; // Assicurati del nome file corretto
import { BookingCalculator } from '../../core/services/booking-calculator';

// Models & Strategies
import { Room } from '../../core/models/room.model';
import { StandardPricingStrategy } from '../../core/strategies/price.strategy'; // O il percorso dove hai salvato le strategie

// Components
import { PaymentModal } from '../payment-modal/payment-modal';

@Component({
  selector: 'app-room-detail',
  standalone: true,
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
            <li><i class="icon">📶</i> Wi-Fi Gratuito</li>
            <li><i class="icon">🍳</i> Colazione inclusa</li>
            <li><i class="icon">🧹</i> Servizio in camera</li>
            <li><i class="icon">🛡️</i> Cancellazione gratuita</li>
          </ul>
        </div>

        <div class="booking-section">
          <div class="booking-card">

            <h3 style="margin-top: 0;">Il tuo preventivo</h3>

            <div class="calculation-box" *ngIf="totalPrice > 0">
              <div class="row">
                <span>Date ({{ nights }} notti):</span>
                <span style="font-size: 0.85rem">{{ currentCheckIn | date:'dd/MM' }} - {{ currentCheckOut | date:'dd/MM' }}</span>
              </div>
              <div class="row">
                <span>Tariffa applicata:</span>
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
              {{ authService.isLoggedIn ? 'Prenota Ora' : 'Accedi per Prenotare' }}
            </button>

            <p class="note">
              <span *ngIf="!authService.isLoggedIn">Verrai reindirizzato al login. </span>
              Nessun addebito immediato.
            </p>
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
      <div class="error-container">
        <h2>Stanza non trovata!</h2>
        <button routerLink="/" class="back-btn">Torna alla Home</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-container { max-width: 1100px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-family: 'Segoe UI', sans-serif; }

    .image-header img { width: 100%; height: 400px; object-fit: cover; }

    .content-grid { display: grid; grid-template-columns: 1.8fr 1.2fr; gap: 50px; padding: 3rem; }
    @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; padding: 1.5rem; } }

    .back-btn { background: none; border: none; color: #666; cursor: pointer; margin-bottom: 1rem; text-decoration: underline; font-size: 0.9rem; }

    h1 { margin: 0 0 15px 0; color: #2c3e50; font-size: 2.2rem; }

    .base-price-tag { display: inline-block; background: #eef2f7; color: #4a5568; padding: 6px 12px; border-radius: 6px; margin-bottom: 25px; font-size: 0.9rem; border: 1px solid #cbd5e0; }

    .desc { color: #4a5568; line-height: 1.7; font-size: 1.05rem; margin-bottom: 2rem; }

    .services-list { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .services-list li { color: #555; display: flex; align-items: center; gap: 8px; }

    /* Card Booking */
    .booking-card { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: sticky; top: 30px; }

    .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 1rem; color: #718096; }
    .tariff-name { font-weight: 600; color: #2d3748; background: #e6fffa; color: #2c7a7b; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }

    hr { border: 0; border-top: 1px dashed #cbd5e0; margin: 20px 0; }

    .total-section { display: flex; justify-content: space-between; align-items: center; }
    .total-section > span { font-weight: 600; font-size: 1.1rem; color: #2d3748; }

    .price-stack { display: flex; flex-direction: column; align-items: flex-end; }
    .old-price { text-decoration: line-through; color: #a0aec0; font-size: 1rem; }
    .big-total { font-size: 2rem; font-weight: 800; color: #d4af37; letter-spacing: -0.5px; }

    .btn-book { width: 100%; padding: 16px; background: linear-gradient(135deg, #d4af37 0%, #c5a028 100%); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; font-size: 1.1rem; margin-top: 25px; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
    .btn-book:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(212, 175, 55, 0.4); }

    .note { font-size: 0.8rem; color: #a0aec0; margin-top: 15px; text-align: center; }
    .error-container { text-align: center; padding: 50px; }
  `]
})
export class RoomDetail implements OnInit {
  // Dependency Injection
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  private calculator = inject(BookingCalculator); // Il nostro nuovo Service che gestisce le strategie
  public authService = inject(AuthService);       // Public per usarlo nell'HTML

  // Stato della Stanza
  room: Room | undefined;

  // Variabili per il calcolo prezzi
  totalPrice = 0;
  originalPrice = 0; // Serve per mostrare il prezzo barrato (es. Standard vs Scontato)
  appliedTariff = '';
  nights = 0;

  // Stato del Modale e Date
  showModal = false;
  currentCheckIn = '';
  currentCheckOut = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.room = this.roomService.getRoomById(id);
      // Appena carichiamo la stanza, calcoliamo il preventivo
      this.calculatePreview();
    }
  }

  /**
   * Calcola il prezzo basandosi sulle date selezionate (o default)
   * e sulla strategia migliore disponibile.
   */
  calculatePreview() {
    // 1. Recupera le date dalla ricerca (o usa date default)
    const criteria = this.roomService.searchCriteria();
    let checkIn = criteria.checkIn;
    let checkOut = criteria.checkOut;

    // Fallback: se non ci sono date, imposta Oggi -> Domani
    if (!checkIn || !checkOut) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      checkIn = this.formatDate(today);
      checkOut = this.formatDate(tomorrow);
    }

    if (this.room && checkIn && checkOut) {
      this.currentCheckIn = checkIn;
      this.currentCheckOut = checkOut;

      // 2. Chiede al Calculator la strategia migliore (es. LongStay se > 7 notti)
      const bestStrategy = this.calculator.getBestStrategy(checkIn, checkOut);

      // 3. Calcola il prezzo finale
      this.totalPrice = this.calculator.calculateTotal(bestStrategy, this.room.pricePerNight, checkIn, checkOut);
      this.appliedTariff = bestStrategy.getName();

      // 4. Calcola il prezzo "Standard" per confronto (Prezzo Barrato)
      const standardStrategy = new StandardPricingStrategy();
      this.originalPrice = this.calculator.calculateTotal(standardStrategy, this.room.pricePerNight, checkIn, checkOut);

      // 5. Calcola durata notti per la UI
      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();
      this.nights = Math.ceil((end - start) / (1000 * 3600 * 24));
    }
  }

  /**
   * Gestisce il click su "Prenota Ora"
   */
  onBook() {
    if (this.authService.isLoggedIn) {
      // Caso 1: Utente loggato -> Apre il modale di pagamento
      this.showModal = true;
    } else {
      // Caso 2: Utente NON loggato -> Redirect al login

      // Salva l'URL corrente per tornarci dopo il login
      this.authService.redirectUrl = this.router.url;

      // Naviga alla pagina di login
      this.router.navigate(['/login']);
    }
  }

  // Helper privato per formattare le date (YYYY-MM-DD)
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
