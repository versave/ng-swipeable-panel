import {
	Directive,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { NgSwipeablePanelService } from '../services/ng-swipeable-panel.service';
import { Subject, takeUntil } from 'rxjs';
import { PanelInfo } from '../models/models';

@Directive({
	selector: '[ngSwipeablePanelTrigger]',
	exportAs: 'ngSwipeablePanelTrigger',
})
export class NgSwipeablePanelTrigger implements OnInit, OnDestroy {
	@Input() public ngSwipeablePanelTrigger = '';
	@Output() public panelActiveEvent = new EventEmitter<PanelInfo>();

	@HostListener('click') private onClick(): void {
		this.ngSwipeablePanelService.setPanelActive({
			name: this.ngSwipeablePanelTrigger,
			active: true,
		});
	}

	private destroy$ = new Subject<unknown>();

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {}

	public ngOnInit(): void {
		this.ngSwipeablePanelService.panelActive$
			.pipe(takeUntil(this.destroy$))
			.subscribe((panel: PanelInfo) => {
				this.panelActiveEvent.emit(panel);
			});
	}

	public ngOnDestroy(): void {
		this.destroy$.next(null);
	}

	public togglePanel(active: boolean): void {
		this.ngSwipeablePanelService.setPanelActive({
			name: this.ngSwipeablePanelTrigger,
			active,
		});
	}
}
