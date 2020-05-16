import { TestBed } from '@angular/core/testing';

import { ObservatoinParserService } from './observatoin-parser.service';

describe('ObservatoinParserService', () => {
  let service: ObservatoinParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservatoinParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
