import { Directive, ViewContainerRef } from '@angular/core';
import { NgSwipeablePanelService } from '../../services/ng-swipeable-panel.service';

@Directive({
    selector: '[ngSwipeablePanelContentContainer]',
})
export class NgSwipeablePanelContentContainerDirective {
    constructor(
        private viewContainerRef: ViewContainerRef,
        private ngSwipeablePanelService: NgSwipeablePanelService,
    ) {
        this.ngSwipeablePanelService.setContainerRef(this.viewContainerRef);
    }
}
