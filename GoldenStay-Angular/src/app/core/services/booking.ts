import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;

  user: {
    name: string;
    email: string;
  };
  room: {
    title: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bookings';

  bookings = signal<Booking[]>([]);

  // Carica le prenotazioni dal backend
  loadBookings() {
    // 2. CORREZIONE URL: Aggiungiamo "/all" perché il Controller ha @GetMapping("/all")
    this.http.get<Booking[]>(`${this.apiUrl}/all`).subscribe({
      next: (data) => {
        console.log('Dati ricevuti dal DB:', data); // Controlla questo log nel browser!
        this.bookings.set(data);
      },
      error: (err) => console.error('Errore caricamento prenotazioni:', err)
    });
  }

  cancelBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/cancel/${id}`).pipe( // Solitamente è DELETE, controlla il controller
      tap(() => this.loadBookings())
    );
  }

  creaPrenotazione(datiPrenotazione: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salva`, datiPrenotazione);
  }
}
