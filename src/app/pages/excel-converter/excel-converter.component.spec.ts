import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelConverterComponent } from './excel-converter.component';

describe('ExcelConverterComponent', () => {
  let component: ExcelConverterComponent;
  let fixture: ComponentFixture<ExcelConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelConverterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
