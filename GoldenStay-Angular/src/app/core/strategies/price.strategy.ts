// 1. L'Interfaccia comune (Il "Contratto")
export interface PricingStrategy {
  calculate(pricePerNight: number, nights: number): number;
  getName(): string; // Giusto per mostrare nell'UI quale tariffa è applicata
}

// 2. Strategia Standard (Nessuno sconto)
export class StandardPricingStrategy implements PricingStrategy {
  calculate(pricePerNight: number, nights: number): number {
    return pricePerNight * nights;
  }
  getName() { return 'Tariffa Standard'; }
}

// 3. Strategia "Soggiorno Lungo" (Sconto 15% se > 7 notti)
export class LongStayDiscountStrategy implements PricingStrategy {
  calculate(pricePerNight: number, nights: number): number {
    let total = pricePerNight * nights;
    if (nights > 7) {
      total = total * 0.85; // Applica sconto 15%
    }
    return total;
  }
  getName() { return 'Sconto Soggiorno Lungo (-15%)'; }
}

// 4. Strategia "WeekEnd" (Esempio: +20%)
export class WeekendStrategy implements PricingStrategy {
  calculate(pricePerNight: number, nights: number): number {
    return (pricePerNight * 1.20) * nights;
  }
  getName() { return 'Tariffa Weekend (+20%)'; }
}
