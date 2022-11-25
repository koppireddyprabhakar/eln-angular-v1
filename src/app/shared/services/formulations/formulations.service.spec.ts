import { TestBed } from '@angular/core/testing';

import { FormulationsService } from './formulations.service';

describe('FormulationsService', () => {
  let service: FormulationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
