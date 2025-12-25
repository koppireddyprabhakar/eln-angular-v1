import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaAnalysisApprovalComponent } from './qa-analysis-approval.component';

describe('QaAnalysisApprovalComponent', () => {
  let component: QaAnalysisApprovalComponent;
  let fixture: ComponentFixture<QaAnalysisApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaAnalysisApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaAnalysisApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
