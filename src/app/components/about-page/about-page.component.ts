import { Component, OnInit } from '@angular/core';
import { NgSwipeablePanelService } from '../../../../projects/ng-swipeable-panel/src/lib/swipeable-panel/services/ng-swipeable-panel.service';
import { PanelInfo } from '../../../../projects/ng-swipeable-panel/src/lib/shared/models/models';

@Component({
	selector: 'app-about-page',
	templateUrl: './about-page.component.html',
	styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent {
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
