import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSwipeablePanelModule } from '../../projects/ng-swipeable-panel/src/lib/ng-swipeable-panel.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';

@NgModule({
  declarations: [AppComponent, HomePageComponent, AboutPageComponent],
  imports: [BrowserModule, AppRoutingModule, NgSwipeablePanelModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
