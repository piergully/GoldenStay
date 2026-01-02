import { PricingStrategy } from './price.strategy';

// 3. Il Context
export class BookingContext {
  private strategy: PricingStrategy;

  // Accetta una qualsiasi classe che rispetti l'interfaccia PricingStrategy
  constructor(initialStrategy: PricingStrategy) {
    this.strategy = initialStrategy;
  }

  public setStrategy(newStrategy: PricingStrategy): void {
    this.strategy = newStrategy;
    console.log(`>>> Strategia aggiornata a: ${this.strategy.getName()}`);
  }

  public executeCalculation(pricePerNight: number, nights: number): number {
    return this.strategy.calculate(pricePerNight, nights);
  }
}
