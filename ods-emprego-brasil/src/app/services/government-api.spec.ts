import { TestBed } from '@angular/core/testing';

import { GovernmentApi } from './government-api';

describe('GovernmentApi', () => {
  let service: GovernmentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernmentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
