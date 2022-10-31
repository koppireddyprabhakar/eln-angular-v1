import { TestBed } from '@angular/core/testing';

import { InwardManagementService } from './inward-management.service';

describe('InwardManagementService', () => {
  let service: InwardManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InwardManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
