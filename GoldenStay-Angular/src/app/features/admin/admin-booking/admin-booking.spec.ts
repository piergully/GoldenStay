import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingsComponent } from './admin-booking';

describe('AdminBooking', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
