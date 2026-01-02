import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { Room } from '../../core/models/room.model';
import { BookingService } from '../../core/services/booking';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.html',
  styleUrls: ['./payment-modal.css']
})
export class PaymentModal {
  private bookingService = inject(BookingService);

  @Input() room: Room | undefined;
  @Input() totalPrice: number = 0;
  @Input() guestName: string = '';
  @Input() checkIn: string = '';
  @Input() checkOut: string = '';
  @Input() email: string = '';
  @Input() guests: number = 1;

  @Output() close = new EventEmitter<void>();

  step: 'form' | 'loading' | 'success' = 'form';

  cardName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

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

  processPayment() {
    if (this.cardNumber.replace(/\s/g, '').length < 16 || this.cardCvv.length < 3) {
      alert('Dati carta incompleti!');
      return;
    }

    this.step = 'loading';

    // mappatura esatta per il tuo Booking.java
    const datiPerJava = {
      nomeUtente: this.guestName,
      // Se title è vuoto, proviamo a usare name o una stringa fissa
      nomeStanza: this.room?.title || (this.room as any)?.name || 'Stanza GoldenStay',
      dataArrivo: this.checkIn,
      dataPartenza: this.checkOut,
      ospiti: this.guests,
      prezzoTotale: this.totalPrice,
      status: 'CONFERMATA'
    };

    console.log('Invio dati al database:', datiPerJava);

    this.bookingService.creaPrenotazione(datiPerJava).subscribe({
      next: (risposta) => {
        console.log('✅ Prenotazione salvata:', risposta);
        setTimeout(() => {
          this.step = 'success';
        }, 1000);
      },
      error: (errore) => {
        console.error('❌ Errore durante il salvataggio:', errore);
        // Se vedi questo errore, controlla i log di IntelliJ!
        alert('Errore di comunicazione con il database. Controlla il terminale del Backend.');
        this.step = 'form';
      }
    });
  }

  generatePDF() {
    const doc = new jsPDF();
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('GoldenStay - Ticket', 20, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Conferma Prenotazione', 20, 60);
    doc.setFontSize(12);
    doc.text(`Ospite: ${this.guestName}`, 20, 80);
    doc.text(`Email: ${this.email}`, 20, 90);
    doc.text(`Stanza: ${this.room?.title || 'Stanza Selezionata'}`, 20, 100);
    doc.text(`Check-in: ${this.checkIn}`, 20, 110);
    doc.text(`Check-out: ${this.checkOut}`, 20, 120);
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(14);
    doc.text(`Totale Pagato: €${this.totalPrice.toFixed(2)}`, 20, 140);
    doc.save(`GoldenStay_Ticket_${this.guestName}.pdf`);
  }
}
