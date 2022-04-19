import { NgSwipeablePanelTrigger } from './ng-swipeable-panel-trigger.directive';
import { NgSwipeablePanelService } from '../services/ng-swipeable-panel.service';

describe('NgSwipeablePanelDirective', () => {
	it('should create an instance', () => {
		const directive = new NgSwipeablePanelTrigger(new NgSwipeablePanelService());
		expect(directive).toBeTruthy();
	});
});
