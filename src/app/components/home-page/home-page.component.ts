import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgSwipeablePanelTrigger } from '../../../../projects/ng-swipeable-panel/src/lib/swipeable-panel/directives/ng-swipeable-panel-trigger.directive';
import { PanelInfo } from '../../../../projects/ng-swipeable-panel/src/lib/shared/models/models';
import { NgSwipeablePanelService } from '../../../../projects/ng-swipeable-panel/src/lib/swipeable-panel/services/ng-swipeable-panel.service';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
	public panelOneName = 'panel-one';
	public panelOneExpanded = false;

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}

	public ngOnInit(): void {
		this.ngSwipeablePanelService.panelExpanded$.subscribe((panelInfo: PanelInfo) => {
			this.panelOneExpanded = panelInfo.active;
		});
	}

	public togglePanel(toggle: boolean): void {
		this.ngSwipeablePanelService.panelExpanded = {
			name: this.panelOneName,
			active: toggle,
		};

		this.panelOneExpanded = toggle;
	}

	public handlePanelActiveEvent(panel: PanelInfo): void {
		console.log('panel change event', panel);
	}
}
