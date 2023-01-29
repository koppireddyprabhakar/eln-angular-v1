import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormulationsComponent } from './review-formulations.component';

describe('ReviewFormulationsComponent', () => {
  let component: ReviewFormulationsComponent;
  let fixture: ComponentFixture<ReviewFormulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFormulationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
