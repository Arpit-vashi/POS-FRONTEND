import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBarcodeComponent } from './print-barcode.component';

describe('PrintBarcodeComponent', () => {
  let component: PrintBarcodeComponent;
  let fixture: ComponentFixture<PrintBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintBarcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
