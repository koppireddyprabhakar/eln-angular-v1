import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExperimentsComponent } from './project-experiments.component';

describe('ProjectExperimentsComponent', () => {
  let component: ProjectExperimentsComponent;
  let fixture: ComponentFixture<ProjectExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectExperimentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectExperimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
