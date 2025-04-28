import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaReviewComponent } from './coa-review.component';

describe('CoaReviewComponent', () => {
  let component: CoaReviewComponent;
  let fixture: ComponentFixture<CoaReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
