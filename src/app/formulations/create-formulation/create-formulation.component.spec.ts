import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormulationComponent } from './create-formulation.component';

describe('CreateFormulationComponent', () => {
  let component: CreateFormulationComponent;
  let fixture: ComponentFixture<CreateFormulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFormulationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFormulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
