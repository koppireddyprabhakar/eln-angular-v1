import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrfComponent } from './trf.component';

describe('TrfComponent', () => {
  let component: TrfComponent;
  let fixture: ComponentFixture<TrfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
