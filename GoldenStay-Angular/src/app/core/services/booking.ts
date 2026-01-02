import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  nomeUtente: string;
  nomeStanza: string;
  dataArrivo: string;
  dataPartenza: string;
  status: string;
  prezzoTotale: number;
  ospiti: number;
}

// FONDAMENTALE: Senza questo Angular non "vede" il servizio!
@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bookings';

  // Signal per la lista (ottimo per la reattività della tabella admin)
  bookings = signal<Booking[]>([]);

  // Carica le prenotazioni dal backend
  loadBookings() {
    this.http.get<Booking[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.bookings.set(data);
        console.log('Prenotazioni caricate:', data);
      },
      error: (err) => console.error('Errore caricamento prenotazioni:', err)
    });
  }

  // Annulla prenotazione
  cancelBooking(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {}).pipe(
      tap(() => this.loadBookings())
    );
  }

  // Salva la nuova prenotazione nel DB
  creaPrenotazione(datiPrenotazione: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/salva`, datiPrenotazione);
  }
}
