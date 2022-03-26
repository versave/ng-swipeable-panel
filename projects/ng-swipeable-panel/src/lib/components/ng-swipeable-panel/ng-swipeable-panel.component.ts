import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSwipeablePanelBaseComponent } from '../ng-swipeable-panel-base/ng-swipeable-panel-base.component';
import { filter } from 'rxjs';

@Component({
	selector: 'ng-swipeable-panel',
	templateUrl: './ng-swipeable-panel.component.html',
	styleUrls: [
		'../ng-swipeable-panel-base/ng-swipeable-panel-base.component.scss',
		'./ng-swipeable-panel.component.scss',
	],
	inputs: NgSwipeablePanelBaseComponent.inputs,
})
export class NgSwipeablePanelComponent extends NgSwipeablePanelBaseComponent implements OnInit {
	@ViewChild('container', { static: true }) public container: ElementRef<HTMLDivElement>;

	public currentPosition = this.minContainerHeight;

	private startTouchYPosition = 0;
	private touchYPosition = 0;

	constructor() {
		super();
	}

	public ngOnInit(): void {
		this.setInitialTouchPositions();
		this.readjustOnWindowResize();
	}

	public setTouchPositions(event: TouchEvent): void {
		const touchY = event.touches[0].clientY;

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
	}

	public setTouchEndPositions(): void {
		this.transition = true;

		if (this.isHalfAboveOrBelow('below', this.currentPosition)) {
			this.touchYPosition = 0;
			this.startTouchYPosition = 0;
			this.currentPosition = this.minContainerHeight;
		} else if (this.isHalfAboveOrBelow('above', this.currentPosition)) {
			this.currentPosition = this.maxContainerHeight;
		}
	}

	public handleTransform(): string {
		const yPosition = `calc(100% - ${this.currentPosition}px)`;
		return `translate3d(0, ${yPosition}, 0)`;
	}

	private setInitialTouchPositions(): void {
		this.currentPosition = this.minContainerHeight;

		if (this.startExpanded) {
			this.currentPosition = this.maxContainerHeight;
			this.touchYPosition = this.maxContainerHeight;
			this.startTouchYPosition = this.getClientRectTopAddition(this.container);
		}
	}

	private readjustOnWindowResize(): void {
		this.onWindowResize$
			.pipe(filter(() => this.isExpanded(this.currentPosition)))
			.subscribe(
				() => (this.startTouchYPosition = this.getClientRectTopAddition(this.container)),
			);
	}
}
