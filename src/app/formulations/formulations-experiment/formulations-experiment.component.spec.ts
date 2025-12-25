import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationsExperimentComponent } from './formulations-experiment.component';

describe('FormulationsExperimentComponent', () => {
  let component: FormulationsExperimentComponent;
  let fixture: ComponentFixture<FormulationsExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulationsExperimentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulationsExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
