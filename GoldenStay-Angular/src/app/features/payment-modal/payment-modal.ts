import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

// Models
import { Room } from '../../core/models/room.model';

// Services
import { BookingService } from '../../core/services/booking';
import { AuthService } from '../../core/services/auth'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.html',
  styleUrls: ['./payment-modal.css']
})
export class PaymentModal {

  // Dependency Injection
  private bookingService = inject(BookingService);
  private authService = inject(AuthService); // <--- Serve per sapere CHI sta pagando

  // Input ricevuti dal componente padre
  @Input() room: Room | undefined;
  @Input() totalPrice: number = 0;
  @Input() guestName: string = '';
  @Input() checkIn: string = '';
  @Input() checkOut: string = '';
  @Input() email: string = '';
  @Input() guests: number = 1;

  @Output() close = new EventEmitter<void>();

  // Stato del modale
  step: 'form' | 'loading' | 'success' = 'form';

  // Dati Carta di Credito
  cardName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

  // --- FORMATTAZIONE INPUT (Cosmetica) ---

  formatCardNumber(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 16) input = input.substring(0, 16);
    const parts = [];
    for (let i = 0; i < input.length; i += 4) parts.push(input.substring(i, i + 4));
    this.cardNumber = parts.join(' ');
  }

  formatExpiry(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 4) input = input.substring(0, 4);
    if (input.length >= 3) this.cardExpiry = input.substring(0, 2) + '/' + input.substring(2);
    else this.cardExpiry = input;
  }

  formatCVV(event: any) {
    this.cardCvv = event.target.value.replace(/\D/g, '');
  }

  // --- LOGICA DI PAGAMENTO ---

  processPayment() {
    // 1. Validazione base della carta
    if (this.cardNumber.replace(/\s/g, '').length < 16 || this.cardCvv.length < 3) {
      alert('Dati carta incompleti!');
      return;
    }

    // 2. Recuperiamo l'utente loggato dall'AuthService
    const currentUser = this.authService.currentUser();

    // Controllo di sicurezza: se non c'è utente, blocchiamo
    if (!currentUser || !currentUser.id) {
      alert("Errore: Utente non identificato. Effettua nuovamente il login.");
      return;
    }

    this.step = 'loading';

    // 3. Creiamo l'oggetto JSON con i nomi ESATTI che si aspetta Java (BookingRequest.java)
    const datiPerJava = {
      userId: currentUser.id,    // <--- ORA USIAMO L'ID VERO!
      roomId: this.room?.id,     // ID della stanza
      checkIn: this.checkIn,     // Deve essere YYYY-MM-DD
      checkOut: this.checkOut,   // Deve essere YYYY-MM-DD
      totalPrice: this.totalPrice
    };

    console.log('Invio dati al server:', datiPerJava);

    // 4. Chiamata al Backend
    this.bookingService.creaPrenotazione(datiPerJava).subscribe({
      next: (risposta) => {
        console.log('✅ Prenotazione salvata con successo:', risposta);
        // Simuliamo un attimo di caricamento per UX
        setTimeout(() => {
          this.step = 'success';
        }, 1000);
      },
      error: (errore) => {
        console.error('❌ Errore Backend:', errore);
        this.step = 'form';
        alert('Errore durante il pagamento. Controlla che il Backend sia acceso.');
      }
    });
  }

  // --- GENERAZIONE PDF (Ticket) ---

  generatePDF() {
    const doc = new jsPDF();

    // Intestazione scura
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 210, 40, 'F');

    // Titolo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('GoldenStay - Ticket', 20, 25);

    // Corpo del testo
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Conferma Prenotazione', 20, 60);

    doc.setFontSize(12);
    doc.text(`Ospite: ${this.guestName}`, 20, 80);
    doc.text(`Email: ${this.email}`, 20, 90);
    doc.text(`Stanza: ${this.room?.title || 'Stanza Selezionata'}`, 20, 100);
    doc.text(`Check-in: ${this.checkIn}`, 20, 110);
    doc.text(`Check-out: ${this.checkOut}`, 20, 120);

    // Prezzo in Oro
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(14);
    doc.text(`Totale Pagato: €${this.totalPrice.toFixed(2)}`, 20, 140);

    // Scarica il file
    doc.save(`GoldenStay_Ticket_${this.guestName.replace(/\s/g, '_')}.pdf`);
  }
}
