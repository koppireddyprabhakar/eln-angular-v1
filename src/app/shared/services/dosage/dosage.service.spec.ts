import { TestBed } from '@angular/core/testing';

import { DosageService } from './dosage.service';

describe('DosageService', () => {
  let service: DosageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
