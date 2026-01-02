// 1. INTERFACCIA
export interface PricingStrategy {
  calculate(pricePerNight: number, nights: number): number;
  getName(): string;
}

// 2. STRATEGIE CONCRETE
export class StandardPricingStrategy implements PricingStrategy {
  calculate(pricePerNight: number, nights: number): number {
    return pricePerNight * nights;
  }
  getName() { return 'Tariffa Standard'; }
}

export class LongStayDiscountStrategy implements PricingStrategy {
  calculate(pricePerNight: number, nights: number): number {
    let total = pricePerNight * nights;
    if (nights > 7) total = total * 0.85;
    return total;
  }
  getName() { return 'Sconto Soggiorno Lungo (-15%)'; }
}

export class WeekendStrategy implements PricingStrategy {
  calculate(pricePerNight: number, nights: number): number {
    return (pricePerNight * 1.20) * nights;
  }
  getName() { return 'Tariffa Weekend (+20%)'; }
}

