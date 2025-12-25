import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElnLoginComponent } from './eln-login.component';

describe('ElnLoginComponent', () => {
  let component: ElnLoginComponent;
  let fixture: ComponentFixture<ElnLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElnLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElnLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
