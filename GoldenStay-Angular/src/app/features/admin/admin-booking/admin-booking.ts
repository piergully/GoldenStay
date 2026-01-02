import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [BookingService], // Sblocca l'errore NG0201
  templateUrl: './admin-booking.html',
  styles: [`
    .container { max-width: 1200px; margin: 40px auto; padding: 20px; }
    .btn-back { cursor: pointer; border: none; background: none; font-weight: bold; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background-color: #2c3e50; color: white; }
    .badge { padding: 5px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: bold; }
    .confermata { background-color: #e8f5e9; color: #2e7d32; }
    .cancellata { background-color: #ffebee; color: #c62828; }
    .btn-cancel { background-color: #e74c3c; color: white; border: none; padding: 8px 12px; cursor: pointer; }
  `]
})
export class AdminBookingsComponent implements OnInit {
  bookingService = inject(BookingService);
  private router = inject(Router);

  ngOnInit() {
    this.bookingService.loadBookings();
  }

  annullaPrenotazione(id: number) {
    if (confirm('Sei sicuro di voler annullare questa prenotazione?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => {
          alert('✅ Prenotazione annullata!');
          this.bookingService.loadBookings();
        },
        error: () => alert('❌ Errore durante l\'annullamento.')
      });
    }
  }

  tornaIndietro() {
    this.router.navigate(['/admin-dashboard']);
  }
}
