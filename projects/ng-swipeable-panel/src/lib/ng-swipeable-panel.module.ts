import { NgModule } from '@angular/core';
import { NgSwipeablePanelComponent } from './components/ng-swipeable-panel/ng-swipeable-panel.component';
import { CommonModule } from '@angular/common';
import { NgSwipeablePanelExternalComponent } from './components/ng-swipeable-panel-external/ng-swipeable-panel-external.component';
import { NgSwipeablePanelExternalContentContainerDirective } from './components/ng-swipeable-panel-external/ng-swipeable-panel-external-content-container.directive';

@NgModule({
	declarations: [
		NgSwipeablePanelComponent,
		NgSwipeablePanelExternalComponent,
		NgSwipeablePanelExternalContentContainerDirective,
	],
	imports: [CommonModule],
	exports: [NgSwipeablePanelComponent, NgSwipeablePanelExternalContentContainerDirective],
})
export class NgSwipeablePanelModule {}
