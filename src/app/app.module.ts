import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSwipeablePanelModule } from '../../projects/ng-swipeable-panel/src/lib/ng-swipeable-panel.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgSwipeablePanelModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
