import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgSwipeablePanelTrigger } from '../../../../projects/ng-swipeable-panel/src/lib/directives/ng-swipeable-panel-trigger.directive';
import { PanelInfo } from '../../../../projects/ng-swipeable-panel/src/lib/models/models';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit {
	@ViewChild('panelTrigger', { static: true }) public panelTrigger: NgSwipeablePanelTrigger;
	@ViewChild('panelTriggerSecond', { static: true })
	public panelTriggerSecond: NgSwipeablePanelTrigger;

	public fullscreenActive = false;

	constructor() {}

	public ngAfterViewInit(): void {
		// Todo: Investigate for a fix. Error: Content changed after it was checked
		// this.panelTrigger.togglePanel(true);
		// this.panelTriggerSecond.togglePanel(true);
	}

	public setFullScreenActive(): void {
		this.fullscreenActive = true;
	}

	public handlePanelActiveEvent(panel: PanelInfo): void {
		console.log('panel', panel);
	}
}
