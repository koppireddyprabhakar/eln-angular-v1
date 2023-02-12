import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisExperimentDashboardComponent } from './analysis-experiment-dashboard.component';

describe('AnalysisExperimentDashboardComponent', () => {
  let component: AnalysisExperimentDashboardComponent;
  let fixture: ComponentFixture<AnalysisExperimentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisExperimentDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisExperimentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
