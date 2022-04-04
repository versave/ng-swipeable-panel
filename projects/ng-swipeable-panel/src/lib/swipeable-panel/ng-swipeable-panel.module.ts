import { NgModule } from '@angular/core';
import { NgSwipeablePanelComponent } from './components/ng-swipeable-panel/ng-swipeable-panel.component';
import { CommonModule } from '@angular/common';
import { NgSwipeablePanelTrigger } from './directives/ng-swipeable-panel-trigger.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [NgSwipeablePanelComponent, NgSwipeablePanelTrigger],
	imports: [CommonModule, BrowserAnimationsModule],
	exports: [NgSwipeablePanelComponent, NgSwipeablePanelTrigger],
})
export class NgSwipeablePanelModule {}
