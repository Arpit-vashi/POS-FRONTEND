import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvConverterComponent } from './csv-converter.component';

describe('CsvConverterComponent', () => {
  let component: CsvConverterComponent;
  let fixture: ComponentFixture<CsvConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvConverterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CsvConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
