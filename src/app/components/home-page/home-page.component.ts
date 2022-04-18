import { Component } from '@angular/core';
import { PanelInfo } from '../../../../projects/ng-swipeable-panel/src/lib/shared/models/models';
import { NgSwipeablePanelService } from '../../../../projects/ng-swipeable-panel/src/lib/swipeable-panel/services/ng-swipeable-panel.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
	public panelOneName = 'panel-one';
	public panelOneExpanded = true;

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}

	public togglePanelExpanded(): void {
		this.ngSwipeablePanelService.panelExpanded = {
			name: this.panelOneName,
			active: !this.panelOneExpanded,
		};
	}

	public handlePanelOneExpanded(panelInfo: PanelInfo): void {
		this.panelOneExpanded = panelInfo.active;
	}
}
