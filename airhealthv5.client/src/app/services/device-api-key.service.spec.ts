import { TestBed } from '@angular/core/testing';

import { DeviceApiKeyService } from './device-api-key.service';

describe('DeviceApiKeyService', () => {
  let service: DeviceApiKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceApiKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
