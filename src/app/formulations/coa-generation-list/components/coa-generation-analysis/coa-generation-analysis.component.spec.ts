import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaGenerationAnalysisComponent } from './coa-generation-analysis.component';

describe('CoaGenerationAnalysisComponent', () => {
  let component: CoaGenerationAnalysisComponent;
  let fixture: ComponentFixture<CoaGenerationAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaGenerationAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaGenerationAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
