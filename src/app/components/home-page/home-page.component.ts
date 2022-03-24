import {
    AfterViewInit,
    Component,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { NgSwipeablePanelService } from '../../../../projects/ng-swipeable-panel/src/lib/services/ng-swipeable-panel.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit {
    @ViewChild('swipeableContent') private swipeableContent: TemplateRef<any>;

    constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}

    public ngAfterViewInit(): void {
        this.ngSwipeablePanelService.createPanel(
            'swipeableContent',
            this.swipeableContent,
            {
                expanded: true,
                fullscreen: true,
            },
        );
    }
}
