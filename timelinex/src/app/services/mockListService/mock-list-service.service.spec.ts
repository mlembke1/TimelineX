import { TestBed } from '@angular/core/testing';

import { MockListServiceService } from './mock-list-service.service';

describe('MockListServiceService', () => {
  let service: MockListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
