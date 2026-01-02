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

  // Funzione per eliminare (ORA È VERA!)
  eliminaStanza(id: number) {
    // 1. Chiediamo conferma per sicurezza, non si sa mai
    if(!confirm('🗑️ Sei sicuro di voler eliminare questa stanza definitivamente?')) {
      return;
    }

    // 2. Chiamiamo il service per cancellare
    this.roomService.deleteRoom(id).subscribe({
      next: () => {
        alert('✅ Stanza eliminata con successo!');
        // La lista si aggiornerà da sola grazie al "tap" nel service
      },
      error: (err) => {
        console.error('Errore:', err);
        alert('❌ Impossibile eliminare la stanza. Controlla la console.');
      }
    });
  }
}
