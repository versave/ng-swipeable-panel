import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgSwipeablePanelTrigger } from '../../../../projects/ng-swipeable-panel/src/lib/directives/ng-swipeable-panel-trigger.directive';

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
		// this.panelTrigger.togglePanel(true);
		// this.panelTriggerSecond.togglePanel(true);
	}

	public setFullScreenActive(): void {
		this.fullscreenActive = true;
	}
}
