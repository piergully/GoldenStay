import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Room } from '../models/room.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/rooms';

  rooms = signal<Room[]>([]);

  searchCriteria = signal({
    guests: 1,
    checkIn: '',
    checkOut: ''
  });

  constructor() {
    this.loadRooms();
  }

  loadRooms(checkIn?: string, checkOut?: string) {
    let params = new HttpParams();

    if (checkIn && checkOut) {
      params = params.set('checkIn', checkIn);
      params = params.set('checkOut', checkOut);
    }

    this.http.get<Room[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        console.log('Stanze caricate dal DB:', data.length);
        this.rooms.set(data);
      },
      error: (err) => console.error('Errore Backend:', err)
    });
  }

  // Filtro lato client
  filteredRooms = computed(() => {
    const criteria = this.searchCriteria();
    return this.rooms().filter(room => room.capacity >= criteria.guests);
  });

  updateSearch(guests: number, checkIn: string, checkOut: string) {
    this.searchCriteria.set({ guests, checkIn, checkOut });

  }

  getRoomById(id: number): Room | undefined {
    return this.rooms().find(r => r.id === id);
  }

  // --- AZIONI ADMIN ---

  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadRooms())
    );
  }

  createRoomByFactory(type: string) {
    return this.http.post<Room>(`${this.apiUrl}/create/${type}`, {}).pipe(
      tap(() => this.loadRooms())
    );
  }

  updateRoom(id: number, room: any) {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room).pipe(
      tap(() => this.loadRooms())
    );
  }
}
