import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSwipeablePanelComponent } from './ng-swipeable-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NgSwipeablePanelComponent', () => {
	let component: NgSwipeablePanelComponent;
	let fixture: ComponentFixture<NgSwipeablePanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NgSwipeablePanelComponent],
			imports: [BrowserAnimationsModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NgSwipeablePanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
