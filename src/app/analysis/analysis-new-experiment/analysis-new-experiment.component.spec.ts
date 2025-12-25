import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisNewExperimentComponent } from './analysis-new-experiment.component';

describe('AnalysisNewExperimentComponent', () => {
  let component: AnalysisNewExperimentComponent;
  let fixture: ComponentFixture<AnalysisNewExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisNewExperimentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisNewExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
