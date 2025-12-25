import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormulationsListComponent } from './review-formulations-list.component';

describe('ReviewFormulationsListComponent', () => {
  let component: ReviewFormulationsListComponent;
  let fixture: ComponentFixture<ReviewFormulationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFormulationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormulationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
