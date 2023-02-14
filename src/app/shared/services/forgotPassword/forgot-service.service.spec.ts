import { TestBed } from '@angular/core/testing';

import { ForgetServiceService } from './forgot-service';

describe('ForgetServiceService', () => {
  let service: ForgetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
