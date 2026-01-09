import { Injectable } from '@angular/core';
import { PricingStrategy, StandardPricingStrategy, LongStayDiscountStrategy, WeekendStrategy } from '../strategies/price.strategy';

@Injectable({
  providedIn: 'root'
})
export class BookingCalculator {


  public calculateTotal(strategy: PricingStrategy, pricePerNight: number, checkIn: string, checkOut: string): number {
    const nights = this.getNights(checkIn, checkOut);
    if (nights <= 0) return 0;
    return strategy.calculate(pricePerNight, nights);
  }

  // --- LOGICA DI SCELTA (FACTORY) ---

  /**
   * Strategia migliore.
   * Ordine di priorità:
   * 1. Sconto Lungo Soggiorno (vince su tutto)
   * 2. Maggiorazione Weekend (solo se non è lungo soggiorno)
   * 3. Standard
   */
  public getBestStrategy(checkIn: string, checkOut: string): PricingStrategy {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = this.getNights(checkIn, checkOut);

    // 1. Verifichiamo se si può applicare lo sconto
    if (nights > 7) {
      return new LongStayDiscountStrategy();
    }

    // 2. Se è un soggiorno breve, controlliamo se cade nel weekend
    if (this.hasWeekend(start, end)) {
      return new WeekendStrategy();
    }

    // 3. Altrimenti tariffa normale
    return new StandardPricingStrategy();
  }

  // --- HELPER PRIVATI ---

  private getNights(inDate: string, outDate: string): number {
    if (!inDate || !outDate) return 0;
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diff = end.getTime() - start.getTime();

    // Math.ceil assicura che se esci tardi conta come notte (opzionale)
    const nights = Math.ceil(diff / (1000 * 3600 * 24));
    return nights > 0 ? nights : 0;
  }

  /**
   * Scansiona i giorni reali per vedere se includono venerdì notte o sabato notte.
   */
  private hasWeekend(start: Date, end: Date): boolean {
    // Cloniamo la data per non modificare l'oggetto originale durante il loop
    let current = new Date(start);
    const endDate = new Date(end);

    while (current < endDate) {
      const day = current.getDay();
      // 5 = Venerdì (notte su sabato), 6 = Sabato (notte su domenica)
      if (day === 5 || day === 6) {
        return true;
      }
      // Avanza di 1 giorno
      current.setDate(current.getDate() + 1);
    }
    return false;
  }
}
