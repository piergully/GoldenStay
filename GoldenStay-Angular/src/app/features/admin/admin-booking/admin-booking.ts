import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-booking.html', // Controlla che il nome file sia giusto
  styles: [`
    .container { max-width: 1200px; margin: 40px auto; padding: 20px; }
    h1 { color: #2c3e50; margin-bottom: 20px; }

    table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-radius: 10px; overflow: hidden; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background-color: #2c3e50; color: white; font-weight: 500; text-transform: uppercase; font-size: 0.9rem; }
    tr:hover { background-color: #f8f9fa; }

    .badge { padding: 5px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: bold; }
    .confermata { background-color: #e8f5e9; color: #2e7d32; }
    .cancellata { background-color: #ffebee; color: #c62828; }

    .btn-cancel {
      background-color: #e74c3c; color: white; border: none; padding: 8px 12px;
      border-radius: 5px; cursor: pointer; transition: 0.3s; font-size: 0.8rem;
    }
    .btn-cancel:hover { background-color: #c0392b; }
  `]
})
export class AdminBookingsComponent implements OnInit {

  bookingService = inject(BookingService);

  ngOnInit() {
    this.bookingService.loadBookings();
  }

  annullaPrenotazione(id: number) {
    if (confirm('Sei sicuro di voler annullare questa prenotazione?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => alert('✅ Prenotazione annullata!'),
        error: (err) => alert('❌ Errore durante l\'annullamento.')
      });
    }
  }
}
