import { Directive, HostListener, Input } from '@angular/core';
import { NgSwipeablePanelService } from '../services/ng-swipeable-panel.service';

@Directive({
	selector: '[ngSwipeablePanelTrigger]',
})
export class NgSwipeablePanelTrigger {
	@Input() public ngSwipeablePanelTrigger = '';

	@HostListener('click') private onClick(): void {
		if (!this.ngSwipeablePanelTrigger) {
			throw new Error(
				`No panel name provided for the trigger. Please provide a panel name using the [ngSwipeablePanelTrigger] attribute.`,
			);
		}

		this.ngSwipeablePanelService.panelExpanded = {
			name: this.ngSwipeablePanelTrigger,
			active: true,
		};
	}

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}
}
