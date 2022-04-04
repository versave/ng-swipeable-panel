import { TestBed } from '@angular/core/testing';

import { NgSwipeablePanelExternalService } from './ng-swipeable-panel-external.service';

describe('NgSwipeablePanelExternalService', () => {
	let service: NgSwipeablePanelExternalService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NgSwipeablePanelExternalService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
