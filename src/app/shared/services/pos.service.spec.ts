import { TestBed } from '@angular/core/testing';

import { PosService } from './pos.service';

describe('PetpoojaService', () => {
  let service: PosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
