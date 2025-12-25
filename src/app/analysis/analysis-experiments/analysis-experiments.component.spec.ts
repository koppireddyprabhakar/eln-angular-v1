import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisExperimentsComponent } from './analysis-experiments.component';

describe('AnalysisExperimentsComponent', () => {
  let component: AnalysisExperimentsComponent;
  let fixture: ComponentFixture<AnalysisExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisExperimentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisExperimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
