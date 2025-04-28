import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaFormulationApprovalComponent } from './qa-formulation-approval.component';

describe('QaFormulationApprovalComponent', () => {
  let component: QaFormulationApprovalComponent;
  let fixture: ComponentFixture<QaFormulationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaFormulationApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaFormulationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
