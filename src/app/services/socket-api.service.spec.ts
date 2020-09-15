import { TestBed } from '@angular/core/testing';

import { SocketApiService } from './socket-api.service';

describe('SocketApiService', () => {
  let service: SocketApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
