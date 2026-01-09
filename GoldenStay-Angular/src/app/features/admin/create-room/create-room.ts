import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-room.html',
  styles: [`
    .factory-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'Segoe UI', sans-serif;
    }

    .btn-back {
      background: white;
      border: 1px solid #ccc;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: 0.3s;
      margin-bottom: 20px;
      display: inline-block;
    }
    .btn-back:hover { background: #eee; }

    .header-section { text-align: center; margin-bottom: 50px; }
    h1 { font-size: 2.5rem; color: #2c3e50; margin-bottom: 10px; }
    p { color: #7f8c8d; font-size: 1.1rem; }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      justify-content: center;
    }

    .factory-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1); /* Ombra più visibile */
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      border: 1px solid #eee; /* Bordo sottile */
      overflow: hidden;
    }

    .factory-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .icon-box { font-size: 4rem; margin-bottom: 15px; display: block; }
    h3 { margin: 10px 0; color: #2c3e50; font-size: 1.5rem; }
    .desc { color: #95a5a6; margin-bottom: 20px; height: 40px; display: block;}

    .specs {
      display: flex;
      justify-content: space-around;
      margin-bottom: 25px;
      font-weight: bold;
      color: #555;
      background: #f8f9fa;
      padding: 10px;
      border-radius: 10px;
    }

    .btn-produce {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.3s;
    }

    /* Colori specifici */
    .standard { border-top: 5px solid #3498db; }
    .standard .btn-produce { background: #3498db; }
    .standard:hover { border-color: #3498db; }

    .deluxe { border-top: 5px solid #f1c40f; }
    .deluxe .btn-produce { background: #f1c40f; color: #333; }
    .deluxe:hover { border-color: #f1c40f; }

    .suite { border-top: 5px solid #e74c3c; background: #fff5f5; }
    .suite .btn-produce { background: #e74c3c; }
    .suite:hover { border-color: #e74c3c; }

    .badge-vip {
      position: absolute;
      top: 20px;
      right: -35px;
      background: #e74c3c;
      color: white;
      padding: 5px 40px;
      transform: rotate(45deg);
      font-size: 0.8rem;
      font-weight: bold;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
  `]
})
export class CreateRoomComponent {

  private roomService = inject(RoomService);
  private router = inject(Router); // Ci serve per cambiare pagina

  produciStanza(tipo: string) {
    if(!confirm('Vuoi davvero creare una ' + tipo + '?')) return;

    this.roomService.createRoomByFactory(tipo).subscribe({
      next: () => {
        alert('✅ Stanza creata! Ora ti riporto alla dashboard.');
        // Dopo aver creato, torniamo alla lista principale
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Errore nella creazione.');
      }
    });
  }

  // Funzione per il tasto "Annulla"
  tornaIndietro() {
    this.router.navigate(['/admin-dashboard']);
  }
}
