import { TestBed } from '@angular/core/testing';

import { ListLoaderService } from './list-loader.service';

describe('ListLoaderService', () => {
  let service: ListLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
