import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http = inject(HttpClient);

  // URL del Backend Spring Boot
  private apiUrl = 'http://localhost:8080/api/rooms';

  // Array reattivo che si riempirà con i dati del DB
  rooms = signal<Room[]>([]);

  searchCriteria = signal({
    guests: 1,
    checkIn: '',
    checkOut: ''
  });

  constructor() {
    this.loadRooms();
  }

  private loadRooms() {
    // Chiamata GET a Spring Boot
    this.http.get<Room[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Dati ricevuti da Spring Boot:', data);
        this.rooms.set(data);
      },
      error: (err) => console.error('Errore connessione backend:', err)
    });
  }

  // Il resto rimane UGUALE (Angular non sa che i dati vengono dal DB!)
  filteredRooms = computed(() => {
    const criteria = this.searchCriteria();
    return this.rooms().filter(room => room.capacity >= criteria.guests);
  });

  updateSearch(guests: number, checkIn: string, checkOut: string) {
    this.searchCriteria.set({ guests, checkIn, checkOut });
  }

  searchCriteriaInfo() {
    return this.searchCriteria();
  }

  getRoomById(id: number): Room | undefined {
    return this.rooms().find(r => r.id === id);
  }
  createRoomByFactory(type: string) {
    return this.http.post<Room>(`${this.apiUrl}/create/${type}`, {}).pipe(
      // IL TRUCCO È QUI: Dopo aver creato, ricarichiamo la lista!
      tap(() => this.loadRooms())
    );
  }
}
