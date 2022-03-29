import { Directive, HostListener, Input } from '@angular/core';
import { NgSwipeablePanelService } from '../services/ng-swipeable-panel.service';

@Directive({
	selector: '[ngSwipeablePanelTrigger]',
	exportAs: 'ngSwipeablePanelTrigger',
})
export class NgSwipeablePanelTrigger {
	@Input() public ngSwipeablePanelTrigger = '';

	@HostListener('click') private onClick(): void {
		this.ngSwipeablePanelService.setPanelActive({
			name: this.ngSwipeablePanelTrigger,
			active: true,
		});
	}

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}

	public togglePanel(active: boolean): void {
		this.ngSwipeablePanelService.setPanelActive({
			name: this.ngSwipeablePanelTrigger,
			active,
		});
	}
}
