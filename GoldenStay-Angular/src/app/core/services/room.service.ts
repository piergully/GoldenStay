import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/rooms';

  rooms = signal<Room[]>([]);

  // Criteri di ricerca
  searchCriteria = signal({
    guests: 1,
    checkIn: '',
    checkOut: ''
  });

  constructor() {
    this.loadRooms();
  }

  // Carica stanze dal DB
  loadRooms() {
    this.http.get<Room[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Stanze caricate:', data);
        this.rooms.set(data);
      },
      error: (err) => console.error('Errore Backend:', err)
    });
  }

  // Filtro
  filteredRooms = computed(() => {
    const criteria = this.searchCriteria();
    return this.rooms().filter(room => room.capacity >= criteria.guests);
  });

  updateSearch(guests: number, checkIn: string, checkOut: string) {
    this.searchCriteria.set({ guests, checkIn, checkOut });
  }

  // CANCELLA STANZA
  // Ora funziona perché abbiamo aggiunto @DeleteMapping nel backend
  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadRooms()) // Ricarica la lista dopo aver cancellato
    );
  }

  // CREA STANZA (FACTORY)
  // Ora funziona perché abbiamo aggiunto @PostMapping("/create/{type}") nel backend
  createRoomByFactory(type: string) {
    return this.http.post<Room>(`${this.apiUrl}/create/${type}`, {}).pipe(
      tap(() => this.loadRooms()) // Ricarica la lista dopo aver creato
    );
  }

  getRoomById(id: number): Room | undefined {
    return this.rooms().find(r => r.id === id);
  }
  // Aggiungi questo sotto a deleteRoom
  updateRoom(id: number, room: any) {
    // Nota: chiamiamo l'URL base + id
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room).pipe(
      tap(() => this.loadRooms()) // Ricarica la lista dopo la modifica
    );
  }
}
