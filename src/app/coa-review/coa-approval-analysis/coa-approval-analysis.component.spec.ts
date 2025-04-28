import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaApprovalAnalysisComponent } from './coa-approval-analysis.component';

describe('CoaApprovalAnalysisComponent', () => {
  let component: CoaApprovalAnalysisComponent;
  let fixture: ComponentFixture<CoaApprovalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaApprovalAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaApprovalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
