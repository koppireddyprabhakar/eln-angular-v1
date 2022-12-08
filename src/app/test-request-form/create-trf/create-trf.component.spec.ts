import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrfComponent } from './create-trf.component';

describe('CreateTrfComponent', () => {
  let component: CreateTrfComponent;
  let fixture: ComponentFixture<CreateTrfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTrfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
