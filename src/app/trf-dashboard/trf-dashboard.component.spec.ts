import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrfDashboardComponent } from './trf-dashboard.component';

describe('TrfDashboardComponent', () => {
  let component: TrfDashboardComponent;
  let fixture: ComponentFixture<TrfDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrfDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrfDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
