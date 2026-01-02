import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs'; // <--- Aggiunto questo import utile

// 1. Interfaccia per QUANDO LEGGI dal server (nomi come arrivano dal JSON backend)
export interface Booking {
  id: number;
  checkIn: string;
  checkOut: string;
  status: string;
  room?: {
    id: number;
    title: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);
  // Indirizzo base: assicurati che il tuo Controller Java risponda qui
  private apiUrl = 'http://localhost:8080/api/bookings';

  // 2. Il Signal per la lista
  bookings = signal<Booking[]>([]);

  // 3. Carica le prenotazioni
  loadBookings() {
    this.http.get<Booking[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.bookings.set(data);
        console.log('Prenotazioni caricate:', data);
      },
      error: (err) => console.error('Errore caricamento prenotazioni:', err)
    });
  }

  // 4. Annulla prenotazione
  cancelBooking(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {}).pipe(
      tap(() => this.loadBookings())
    );
  }

  // --- 5. NUOVO METODO: Crea Prenotazione ---

  creaPrenotazione(datiPrenotazione: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/salva`, datiPrenotazione);
  }
}
