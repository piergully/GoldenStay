import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent {

  // Iniettiamo il Service
  roomService = inject(RoomService);

  // Funzione per eliminare (la collegheremo dopo al database)
  eliminaStanza(id: number) {
    if(confirm('Vuoi davvero eliminare questa stanza?')) {
      alert('Funzionalità in arrivo prossimamente! ID: ' + id);
    }
  }
}
