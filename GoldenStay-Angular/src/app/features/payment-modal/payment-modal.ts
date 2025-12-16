import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">

        <div class="modal-header">
          <h3>Pagamento Sicuro</h3>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <div class="modal-body">

          @if (step === 'form') {
            <div class="summary">
              Stai prenotando: <strong>{{ room?.title }}</strong><br>
              Totale da pagare: <span class="total">{{ totalPrice | currency:'EUR' }}</span>
            </div>

            <form (ngSubmit)="processPayment()">
              <div class="form-group">
                <label>Intestatario Carta</label>
                <input type="text" placeholder="Mario Rossi" required
                       [(ngModel)]="cardName" name="cardName">
              </div>

              <div class="form-group">
                <label>Numero Carta</label>
                <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" required
                       [(ngModel)]="cardNumber" name="cardNumber"
                       (input)="formatCardNumber($event)">
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Scadenza</label>
                  <input type="text" placeholder="MM/YY" maxlength="5" required
                         [(ngModel)]="cardExpiry" name="cardExpiry"
                         (input)="formatExpiry($event)">
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" maxlength="3" required
                         [(ngModel)]="cardCvv" name="cardCvv"
                         (input)="formatCVV($event)">
                </div>
              </div>

              <button type="submit" class="pay-btn">Paga Ora</button>
            </form>
          }

          @if (step === 'loading') {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Stiamo elaborando il pagamento...</p>
            </div>
          }

          @if (step === 'success') {
            <div class="success-state">
              <div class="check-icon">✅</div>
              <h3>Pagamento Riuscito!</h3>
              <p>La tua prenotazione è confermata.</p>

              <button class="download-btn" (click)="generatePDF()">
                📄 Scarica Ricevuta (PDF)
              </button>
            </div>
          }

        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(5px); }
    .modal-content { background: white; width: 90%; max-width: 450px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .modal-header { background: #2c3e50; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { margin: 0; font-size: 1.1rem; }
    .close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }

    .modal-body { padding: 25px; }

    .summary { background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 0.95rem; color: #555; text-align: center; }
    .total { color: #d4af37; font-weight: bold; font-size: 1.1rem; }

    .form-group { margin-bottom: 15px; }
    label { display: block; font-size: 0.85rem; font-weight: bold; color: #333; margin-bottom: 5px; }
    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
    .row { display: flex; gap: 15px; }
    .row .form-group { flex: 1; }

    .pay-btn { width: 100%; background: #2c3e50; color: white; padding: 12px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-top: 10px; }
    .pay-btn:hover { background: #1a252f; }

    .loading-state { text-align: center; padding: 40px 0; }
    .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .success-state { text-align: center; padding: 20px 0; }
    .check-icon { font-size: 3rem; margin-bottom: 10px; }
    .download-btn { background: #d4af37; color: white; border: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-top: 15px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3); }
    .download-btn:hover { background: #b39028; transform: translateY(-2px); }
  `]
})
export class PaymentModal {
  @Input() room: Room | undefined;
  @Input() totalPrice: number = 0;
  @Input() guestName: string = '';
  @Input() checkIn: string = '';
  @Input() checkOut: string = '';

  @Output() close = new EventEmitter<void>();

  step: 'form' | 'loading' | 'success' = 'form';

  cardName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

  // --- NUOVE FUNZIONI DI FORMATTAZIONE ---

  // Formatta XXXX XXXX XXXX XXXX
  formatCardNumber(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Rimuovi non-numeri
    if (input.length > 16) input = input.substring(0, 16); // Limita a 16 cifre

    // Aggiungi spazio ogni 4
    const parts = [];
    for (let i = 0; i < input.length; i += 4) {
      parts.push(input.substring(i, i + 4));
    }
    this.cardNumber = parts.join(' ');
  }

  // Formatta MM/YY
  formatExpiry(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Rimuovi non-numeri
    if (input.length > 4) input = input.substring(0, 4); // Limita a 4 cifre

    if (input.length >= 3) {
      this.cardExpiry = input.substring(0, 2) + '/' + input.substring(2);
    } else {
      this.cardExpiry = input;
    }
  }

  // Permette solo numeri nel CVV
  formatCVV(event: any) {
    this.cardCvv = event.target.value.replace(/\D/g, '');
  }

  // ---------------------------------------

  processPayment() {
    // Validazione base
    if (this.cardNumber.replace(/\s/g, '').length < 16 || this.cardCvv.length < 3) {
      alert('Dati carta incompleti!');
      return;
    }

    this.step = 'loading';
    setTimeout(() => {
      this.step = 'success';
    }, 2000);
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
    doc.text(`Stanza: ${this.room?.title}`, 20, 90);
    doc.text(`Check-in: ${this.checkIn}`, 20, 100);
    doc.text(`Check-out: ${this.checkOut}`, 20, 110);

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(14);
    doc.text(`Totale Pagato: €${this.totalPrice.toFixed(2)}`, 20, 130);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('Grazie per aver scelto GoldenStay. Mostra questo ticket alla reception.', 20, 150);

    doc.save(`GoldenStay_Ticket_${this.guestName}.pdf`);
  }
}
