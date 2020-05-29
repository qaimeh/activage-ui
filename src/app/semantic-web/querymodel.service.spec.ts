import { TestBed } from '@angular/core/testing';

import { QuerymodelService } from './querymodel.service';

describe('QuerymodelService', () => {
  let service: QuerymodelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuerymodelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
