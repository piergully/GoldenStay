import { Component, inject, OnInit, effect } from '@angular/core'; // Aggiungi OnInit ed effect
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RoomService } from '../../core/services/room.service'; // Importa il service

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="booking-card">
      <div class="header">
        <h3>La tua prenotazione</h3>
        <span class="price-tag">Miglior prezzo</span>
      </div>

      <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">

        <div class="row">
          <div class="form-group">
            <label>Check-in</label>
            <input type="date" formControlName="checkIn">
          </div>
          <div class="form-group">
            <label>Check-out</label>
            <input type="date" formControlName="checkOut">
          </div>
        </div>

        <div class="form-group">
          <label>Ospiti</label>
          <select formControlName="guests">
            <option [value]="1">1 Ospite</option>
            <option [value]="2">2 Ospiti</option>
            <option [value]="3">3 Ospiti</option>
            <option [value]="4">4 Ospiti</option>
          </select>
        </div>

        <hr class="divider">

        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" formControlName="name" placeholder="Il tuo nome">
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="nome@email.com">
        </div>

        <button type="submit" [disabled]="bookingForm.invalid">
          Conferma Prenotazione
        </button>

      </form>

      @if (isSubmitted) {
        <div class="success-message">
          ✅ Richiesta inviata! Ti contatteremo presto.
        </div>
      }
    </div>
  `,
  styles: [`
    .booking-card { background: white; padding: 25px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: sticky; top: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    h3 { margin: 0; color: #2c3e50; font-size: 1.2rem; }
    .price-tag { background: #d4af37; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 6px; font-size: 0.85rem; color: #7f8c8d; font-weight: 600; text-transform: uppercase; }
    input, select { width: 100%; padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; transition: 0.3s; }
    input:focus, select:focus { border-color: #d4af37; outline: none; background: #fffdf5; }
    .row { display: flex; gap: 15px; }
    .row .form-group { flex: 1; }
    .divider { border: 0; border-top: 1px solid #eee; margin: 20px 0; }

    button {
      width: 100%; padding: 15px; background-color: #2c3e50; color: white;
      border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 1.1rem;
    }
    button:hover { background-color: #d4af37; transform: translateY(-2px); }
    button:disabled { background-color: #ccc; cursor: not-allowed; transform: none; }

    .success-message { margin-top: 20px; padding: 15px; background: #e8f5e9; color: #2e7d32; border-radius: 6px; text-align: center; font-weight: bold; }
  `]
})
export class BookingForm implements OnInit {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService); // Iniettiamo il service

  isSubmitted = false;

  bookingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, Validators.required]
  });

  ngOnInit() {
    // 1. Leggiamo i valori attuali della ricerca dal Service
    const searchCriteria = this.roomService.searchCriteria();

    // 2. Aggiorniamo il form SOLO con i campi rilevanti (Date e Ospiti)
    // patchValue serve per aggiornare solo alcuni campi del form
    this.bookingForm.patchValue({
      checkIn: searchCriteria.checkIn,
      checkOut: searchCriteria.checkOut,
      guests: searchCriteria.guests
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Prenotazione:', this.bookingForm.value);
      this.isSubmitted = true;
      // In futuro qui invieremo i dati al server
    }
  }
}
