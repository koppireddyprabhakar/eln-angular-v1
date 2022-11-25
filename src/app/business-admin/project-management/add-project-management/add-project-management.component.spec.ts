import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectManagementComponent } from './add-project-management.component';

describe('AddProjectManagementComponent', () => {
  let component: AddProjectManagementComponent;
  let fixture: ComponentFixture<AddProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
