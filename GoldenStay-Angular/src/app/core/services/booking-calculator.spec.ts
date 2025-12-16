import { TestBed } from '@angular/core/testing';

import { BookingCalculator } from './booking-calculator';

describe('BookingCalculator', () => {
  let service: BookingCalculator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingCalculator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
