import { Injectable } from '@angular/core';
// Importa la nuova WeekendStrategy
import { PricingStrategy, StandardPricingStrategy, LongStayDiscountStrategy, WeekendStrategy } from '../strategies/price.strategy';

@Injectable({
  providedIn: 'root'
})
export class BookingCalculator {

  calculateTotal(strategy: PricingStrategy, pricePerNight: number, checkIn: string, checkOut: string): number {
    const nights = this.getNights(checkIn, checkOut);
    if (nights <= 0) return 0;
    return strategy.calculate(pricePerNight, nights);
  }

  // --- LOGICA DI SCELTA (FACTORY) ---
  getBestStrategy(checkIn: string, checkOut: string): PricingStrategy {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = this.getNights(checkIn, checkOut);

    // 1. Controlliamo se nel periodo c'è un weekend (Venerdì o Sabato notte)
    if (this.hasWeekend(start, end)) {
      return new WeekendStrategy();
    }

    // 2. Se non è weekend, controlliamo la durata
    if (nights > 7) {
      return new LongStayDiscountStrategy();
    }

    // 3. Altrimenti Standard
    return new StandardPricingStrategy();
  }

  // Helper: Conta le notti
  private getNights(inDate: string, outDate: string): number {
    if (!inDate || !outDate) return 0;
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  // Helper: Scansiona i giorni per trovare Venerdì (5) o Sabato (6)
  private hasWeekend(start: Date, end: Date): boolean {
    let current = new Date(start);
    // Cicla giorno per giorno fino alla data di uscita
    while (current < end) {
      const day = current.getDay();
      // 5 = Venerdì, 6 = Sabato
      if (day === 5 || day === 6) {
        return true;
      }
      // Vai al giorno dopo
      current.setDate(current.getDate() + 1);
    }
    return false;
  }
}
