import { NgModule } from '@angular/core';
import { NgSwipeablePanelComponent } from './components/ng-swipeable-panel/ng-swipeable-panel.component';
import { CommonModule } from '@angular/common';
import { NgSwipeablePanelExternalComponent } from './components/ng-swipeable-panel-external/ng-swipeable-panel-external.component';
import { NgSwipeablePanelExternalContentContainerDirective } from './directives/ng-swipeable-panel-external-content-container.directive';
import { NgSwipeablePanelTrigger } from './directives/ng-swipeable-panel-trigger.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [
		NgSwipeablePanelComponent,
		NgSwipeablePanelTrigger,
		NgSwipeablePanelExternalComponent,
		NgSwipeablePanelExternalContentContainerDirective,
	],
	imports: [CommonModule, BrowserAnimationsModule],
	exports: [
		NgSwipeablePanelComponent,
		NgSwipeablePanelTrigger,
		NgSwipeablePanelExternalContentContainerDirective,
	],
})
export class NgSwipeablePanelModule {}
