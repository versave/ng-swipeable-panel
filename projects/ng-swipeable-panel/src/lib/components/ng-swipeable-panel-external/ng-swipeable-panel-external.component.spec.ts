import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSwipeablePanelExternalComponent } from './ng-swipeable-panel-external.component';

describe('NgSwipeablePanelComponent', () => {
	let component: NgSwipeablePanelExternalComponent;
	let fixture: ComponentFixture<NgSwipeablePanelExternalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NgSwipeablePanelExternalComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NgSwipeablePanelExternalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
