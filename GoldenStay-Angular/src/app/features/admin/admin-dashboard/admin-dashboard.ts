import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <--- FONDAMENTALE PER I FORM
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model'; // Assicurati di avere il modello, altrimenti usa 'any'

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // <--- AGGIUNGI FormsModule QUI
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {

  roomService = inject(RoomService);

  // Variabile per gestire la modale: se è null la modale è chiusa
  editingRoom: any = null;

  eliminaStanza(id: number) {
    if(!confirm('🗑️ Sei sicuro di voler eliminare questa stanza?')) return;

    this.roomService.deleteRoom(id).subscribe({
      next: () => alert('✅ Eliminata!'),
      error: (e) => console.error(e)
    });
  }

  // 1. APRE LA MODALE
  apriModifica(room: any) {
    // Creiamo una COPIA della stanza (con {...room})
    // Se non facessimo la copia, modificando l'input cambierebbe anche la card sotto in tempo reale!
    this.editingRoom = { ...room };
  }

  // 2. CHIUDE LA MODALE (Annulla)
  chiudiModale() {
    this.editingRoom = null;
  }

  // 3. SALVA LE MODIFICHE
  salvaModifiche() {
    if (!this.editingRoom) return;

    this.roomService.updateRoom(this.editingRoom.id, this.editingRoom).subscribe({
      next: () => {
        alert('✅ Modifica salvata!');
        this.chiudiModale(); // Chiude la finestra
        // La lista si aggiorna da sola grazie al "tap" nel service
      },
      error: (err) => {
        console.error(err);
        alert('❌ Errore nel salvataggio.');
      }
    });
  }
}
