import { TestBed } from '@angular/core/testing';

import { AppSettingsServiceService } from './app-settings-service.service';

describe('AppSettingsServiceService', () => {
  let service: AppSettingsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSettingsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
