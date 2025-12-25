import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnalysisExperimentComponent } from './view-analysis-experiment.component';

describe('ViewAnalysisExperimentComponent', () => {
  let component: ViewAnalysisExperimentComponent;
  let fixture: ComponentFixture<ViewAnalysisExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAnalysisExperimentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAnalysisExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
