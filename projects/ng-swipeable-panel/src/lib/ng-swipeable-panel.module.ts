import { NgModule } from '@angular/core';
import { NgSwipeablePanelComponent } from './components/ng-swipeable-panel/ng-swipeable-panel.component';
import { CommonModule } from '@angular/common';
import { NgSwipeablePanelContentContainerDirective } from './components/ng-swipeable-panel/ng-swipeable-panel-content-container.directive';

@NgModule({
	declarations: [
		NgSwipeablePanelComponent,
		NgSwipeablePanelContentContainerDirective,
	],
	imports: [CommonModule],
	exports: [
		NgSwipeablePanelComponent,
		NgSwipeablePanelContentContainerDirective,
	],
})
export class NgSwipeablePanelModule {}
