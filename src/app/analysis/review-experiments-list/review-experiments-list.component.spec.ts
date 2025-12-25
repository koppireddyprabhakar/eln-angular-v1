import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewExperimentsListComponent } from './review-experiments-list.component';

describe('ReviewExperimentsListComponent', () => {
  let component: ReviewExperimentsListComponent;
  let fixture: ComponentFixture<ReviewExperimentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewExperimentsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewExperimentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
