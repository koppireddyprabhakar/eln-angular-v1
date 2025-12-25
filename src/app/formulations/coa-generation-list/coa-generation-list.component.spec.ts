import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaGenerationListComponent } from './coa-generation-list.component';

describe('CoaGenerationListComponent', () => {
  let component: CoaGenerationListComponent;
  let fixture: ComponentFixture<CoaGenerationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaGenerationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaGenerationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
