import { TestBed } from '@angular/core/testing';

import { PlatformService } from './platform.service';

describe('PlatformServiceService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
