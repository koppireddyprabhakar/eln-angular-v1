import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReqFormsComponent } from './test-req-forms.component';

describe('TestReqFormsComponent', () => {
  let component: TestReqFormsComponent;
  let fixture: ComponentFixture<TestReqFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestReqFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestReqFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
