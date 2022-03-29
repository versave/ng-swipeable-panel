import { Directive, ViewContainerRef } from '@angular/core';
import { NgSwipeablePanelExternalService } from '../services/ng-swipeable-panel-external.service';

@Directive({
	selector: '[ngSwipeablePanelContentContainer]',
})
export class NgSwipeablePanelExternalContentContainerDirective {
	constructor(
		private viewContainerRef: ViewContainerRef,
		private ngSwipeablePanelService: NgSwipeablePanelExternalService,
	) {
		this.ngSwipeablePanelService.setContainerRef(this.viewContainerRef);
	}
}
