import { ElementRef, Injectable, Input, OnDestroy } from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Injectable()
export abstract class NgSwipeablePanelBaseComponent implements OnDestroy {
	public static inputs = ['minContainerHeight', 'maxContainerHeight', 'startExpanded'];

	@Input() public maxContainerHeight = 235;
	@Input() public minContainerHeight = 30;

	@Input() protected startExpanded = false;

	public transition = false;

	protected destroy$ = new Subject<unknown>();
	protected onWindowResize$ = fromEvent(window, 'resize').pipe(takeUntil(this.destroy$));

	public ngOnDestroy(): void {
		this.destroy$.next(null);
	}

	protected isHalfAboveOrBelow(halfPoint: 'above' | 'below', currentPosition: number): boolean {
		const maxHeightHalf = this.maxContainerHeight / 2;

		if (halfPoint === 'above') {
			return currentPosition >= maxHeightHalf;
		} else {
			return currentPosition <= maxHeightHalf;
		}
	}

	protected isExpanded(currentPosition: number): boolean {
		return currentPosition === this.maxContainerHeight;
	}

	protected getClientRectTopAddition(container: ElementRef<HTMLDivElement>): number {
		const containerBaseHeight = container.nativeElement.clientHeight;
		const clientRectTopAddition = containerBaseHeight - this.minContainerHeight;

		return container.nativeElement.getBoundingClientRect().top + clientRectTopAddition;
	}
}
