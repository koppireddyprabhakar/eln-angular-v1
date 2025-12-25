import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulationsProjectsComponent } from './formulations-projects.component';

describe('FormulationsProjectsComponent', () => {
  let component: FormulationsProjectsComponent;
  let fixture: ComponentFixture<FormulationsProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulationsProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulationsProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
