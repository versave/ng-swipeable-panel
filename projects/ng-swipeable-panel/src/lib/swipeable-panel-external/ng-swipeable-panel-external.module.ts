import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSwipeablePanelExternalContentContainerDirective } from './directives/ng-swipeable-panel-external-content-container.directive';
import { NgSwipeablePanelExternalComponent } from './components/ng-swipeable-panel-external/ng-swipeable-panel-external.component';

@NgModule({
	declarations: [
		NgSwipeablePanelExternalComponent,
		NgSwipeablePanelExternalContentContainerDirective,
	],
	imports: [CommonModule],
	exports: [NgSwipeablePanelExternalComponent, NgSwipeablePanelExternalContentContainerDirective],
})
export class NgSwipeablePanelExternalModule {}
