import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	ViewChild,
} from '@angular/core';
import { NgSwipeablePanelBaseComponent } from '../ng-swipeable-panel-base/ng-swipeable-panel-base.component';

@Component({
	selector: 'ng-swipeable-panel',
	templateUrl: './ng-swipeable-panel.component.html',
	styleUrls: [
		'../ng-swipeable-panel-base/ng-swipeable-panel-base.component.scss',
		'./ng-swipeable-panel.component.scss',
	],
	inputs: NgSwipeablePanelBaseComponent.inputs,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSwipeablePanelComponent
	extends NgSwipeablePanelBaseComponent
	implements AfterViewInit
{
	@ViewChild('container') public container: ElementRef<HTMLDivElement>;

	public currentPosition = this.minContainerHeight;

	private startTouchYPosition = 0;
	private touchYPosition = 0;

	constructor(private cdr: ChangeDetectorRef) {
		super();
	}

	public ngAfterViewInit(): void {
		this.setInitialTouchPosition();
	}

	public handleTransform(): string {
		const initialY = `calc(100% - ${this.currentPosition}px)`;
		return `translate3d(0, ${initialY}, 0)`;
	}

	public touchMove(e: TouchEvent): void {
		const touchY = e.touches[0].clientY;

		if (this.startTouchYPosition === 0) {
			this.startTouchYPosition = touchY;
		}

		if (this.transition) {
			this.transition = false;
		}

		this.touchYPosition = -(touchY - this.startTouchYPosition) + this.minContainerHeight;

		const isAboveMaxHeight = this.touchYPosition >= this.maxContainerHeight;
		const isBelowMinHeight = this.touchYPosition <= this.minContainerHeight;

		if (isAboveMaxHeight) {
			this.currentPosition = this.maxContainerHeight;
		} else if (isBelowMinHeight) {
			this.currentPosition = this.minContainerHeight;
		} else {
			this.currentPosition = this.touchYPosition;
		}

		console.log(this.currentPosition);
	}

	public touchEnd(): void {
		this.transition = true;

		if (this.isHalfAboveOrBelow('below', this.currentPosition)) {
			this.touchYPosition = 0;
			this.startTouchYPosition = 0;
			this.currentPosition = this.minContainerHeight;
		} else if (this.isHalfAboveOrBelow('above', this.currentPosition)) {
			this.currentPosition = this.maxContainerHeight;
		}
	}

	private setInitialTouchPosition(): void {
		if (this.startExpanded) {
			this.currentPosition = this.maxContainerHeight;
			this.touchYPosition = this.maxContainerHeight;
			this.startTouchYPosition = this.container.nativeElement.getBoundingClientRect().top;
			this.cdr.detectChanges();
		}
	}
}
