import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardManagementComponent } from './inward-management.component';

describe('InwardManagementComponent', () => {
  let component: InwardManagementComponent;
  let fixture: ComponentFixture<InwardManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InwardManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InwardManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
