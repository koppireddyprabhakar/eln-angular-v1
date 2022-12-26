import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrfComponent } from './add-trf.component';

describe('AddTrfComponent', () => {
  let component: AddTrfComponent;
  let fixture: ComponentFixture<AddTrfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
