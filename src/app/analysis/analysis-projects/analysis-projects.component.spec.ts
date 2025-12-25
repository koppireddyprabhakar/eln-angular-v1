import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisProjectsComponent } from './analysis-projects.component';

describe('AnalysisProjectsComponent', () => {
  let component: AnalysisProjectsComponent;
  let fixture: ComponentFixture<AnalysisProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
