import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaApprovalFormulationComponent } from './coa-approval-formulation.component';

describe('CoaApprovalFormulationComponent', () => {
  let component: CoaApprovalFormulationComponent;
  let fixture: ComponentFixture<CoaApprovalFormulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaApprovalFormulationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaApprovalFormulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
