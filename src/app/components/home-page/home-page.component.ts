import { AfterViewInit, Component } from '@angular/core';
import { NgSwipeablePanelTrigger } from '../../../../projects/ng-swipeable-panel/src/lib/swipeable-panel/directives/ng-swipeable-panel-trigger.directive';
import { PanelInfo } from '../../../../projects/ng-swipeable-panel/src/lib/shared/models/models';
import { NgSwipeablePanelService } from '../../../../projects/ng-swipeable-panel/src/lib/swipeable-panel/services/ng-swipeable-panel.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit {
	public panelOneName = 'panel-one';

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}

	public ngAfterViewInit(): void {
		// Todo: Investigate for a fix. Error: Content changed after it was checked
		// this.togglePanel(true);
	}

	public togglePanel(toggle: boolean): void {
		this.ngSwipeablePanelService.panelExpanded = {
			name: this.panelOneName,
			active: toggle,
		};
	}

	// public setFullScreenActive(): void {
	// 	this.fullscreenActive = true;
	// }
	//
	public handlePanelActiveEvent(panel: PanelInfo): void {
		console.log('panel change event', panel);
	}
}
