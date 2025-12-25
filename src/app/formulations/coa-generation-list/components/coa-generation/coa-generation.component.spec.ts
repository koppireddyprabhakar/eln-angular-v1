import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaGenerationComponent } from './coa-generation.component';

describe('CoaGenerationComponent', () => {
  let component: CoaGenerationComponent;
  let fixture: ComponentFixture<CoaGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
