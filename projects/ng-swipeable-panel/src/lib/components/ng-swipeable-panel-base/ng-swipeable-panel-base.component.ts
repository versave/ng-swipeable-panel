import { Injectable, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class NgSwipeablePanelBaseComponent implements OnDestroy {
	public static inputs = ['minContainerHeight', 'maxContainerHeight', 'startExpanded'];

	@Input() public maxContainerHeight = 235;
	@Input() public minContainerHeight = 30;
	@Input() protected startExpanded = false;

	public transition = false;
	public destroy$ = new Subject<unknown>();

	public ngOnDestroy(): void {
		this.destroy$.next(undefined);
	}

	protected isHalfAboveOrBelow(halfPoint: 'above' | 'below', currentPosition: number): boolean {
		const maxHeightHalf = this.maxContainerHeight / 2;

		if (halfPoint === 'above') {
			return currentPosition >= maxHeightHalf;
		} else {
			return currentPosition <= maxHeightHalf;
		}
	}
}
