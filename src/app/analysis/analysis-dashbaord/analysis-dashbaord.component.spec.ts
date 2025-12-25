import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisDashbaordComponent } from './analysis-dashbaord.component';

describe('AnalysisDashbaordComponent', () => {
  let component: AnalysisDashbaordComponent;
  let fixture: ComponentFixture<AnalysisDashbaordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisDashbaordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisDashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
