import { TestBed } from '@angular/core/testing';

import { NgSwipeablePanelService } from './ng-swipeable-panel.service';

describe('NgSwipeablePanelService', () => {
  let service: NgSwipeablePanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgSwipeablePanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
