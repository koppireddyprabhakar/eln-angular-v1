import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormulationExperimentComponent } from './view-formulation-experiment.component';

describe('ViewFormulationExperimentComponent', () => {
  let component: ViewFormulationExperimentComponent;
  let fixture: ComponentFixture<ViewFormulationExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFormulationExperimentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFormulationExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
