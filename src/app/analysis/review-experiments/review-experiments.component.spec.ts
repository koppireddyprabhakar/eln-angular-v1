import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewExperimentsComponent } from './review-experiments.component';

describe('ReviewExperimentsComponent', () => {
  let component: ReviewExperimentsComponent;
  let fixture: ComponentFixture<ReviewExperimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewExperimentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewExperimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
