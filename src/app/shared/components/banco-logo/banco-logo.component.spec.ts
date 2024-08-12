import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoLogoComponent } from './banco-logo.component';

describe('BancoLogoComponent', () => {
  let component: BancoLogoComponent;
  let fixture: ComponentFixture<BancoLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BancoLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BancoLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
