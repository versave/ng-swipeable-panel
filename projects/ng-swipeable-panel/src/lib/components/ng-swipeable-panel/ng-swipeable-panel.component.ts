import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgSwipeablePanelBaseComponent } from '../ng-swipeable-panel-base/ng-swipeable-panel-base.component';
import { filter, takeUntil } from 'rxjs';
import { NgSwipeablePanelService } from '../../services/ng-swipeable-panel.service';
import { fullScreenAnimations, FullScreenState } from '../../animations/fullscreen';

@Component({
	selector: 'ng-swipeable-panel',
	templateUrl: './ng-swipeable-panel.component.html',
	styleUrls: [
		'../ng-swipeable-panel-base/ng-swipeable-panel-base.component.scss',
		'./ng-swipeable-panel.component.scss',
	],
	inputs: NgSwipeablePanelBaseComponent.inputs,
	animations: fullScreenAnimations,
})
export class NgSwipeablePanelComponent extends NgSwipeablePanelBaseComponent implements OnInit {
	@ViewChild('container', { static: true }) public container: ElementRef<HTMLDivElement>;

	// Todo: Toggle off on click outside of the container
	@Input() public fullScreen = false;
	@Input() public panelTriggerName = '';

	public currentPosition = this.minContainerHeight;
	public fullScreenActive = false;

	private startTouchYPosition = 0;
	private touchYPosition = 0;

	constructor(private ngSwipeablePanelService: NgSwipeablePanelService) {
		super();
	}

	public ngOnInit(): void {
		this.setInitialTouchPositions();
		this.readjustOnWindowResize();
		this.handleFullScreenInteractions();
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
		} else if (isBelowMinHeight && !this.fullScreen) {
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

			// Hide if in full screen mode
			if (this.fullScreen) {
				this.currentPosition = 0;
				this.setFullScreenPanelActive(false);
			}
		} else if (this.isHalfAboveOrBelow('above', this.currentPosition)) {
			this.currentPosition = this.maxContainerHeight;
		}
	}

	public handleTransform(): string {
		const yPosition = `calc(100% - ${this.currentPosition}px)`;
		return `translate3d(0, ${yPosition}, 0)`;
	}

	public get fullScreenAnimationState(): FullScreenState | null {
		if (!this.fullScreen) {
			return null;
		}

		return this.fullScreenActive ? FullScreenState.visible : FullScreenState.hidden;
	}

	private setInitialTouchPositions(): void {
		this.currentPosition = this.minContainerHeight;

		if (this.startExpanded) {
			this.currentPosition = this.maxContainerHeight;
			this.touchYPosition = this.maxContainerHeight;
			this.startTouchYPosition = this.getClientRectTopAddition(this.container);
		}
	}

	private setInitialFullScreenPositions(): void {
		this.currentPosition = this.maxContainerHeight;
		this.touchYPosition = this.maxContainerHeight;
		this.startTouchYPosition =
			this.container.nativeElement.getBoundingClientRect().top - this.minContainerHeight;
	}

	private readjustOnWindowResize(): void {
		this.onWindowResize$
			.pipe(filter(() => this.isExpanded(this.currentPosition)))
			.subscribe(
				() => (this.startTouchYPosition = this.getClientRectTopAddition(this.container)),
			);
	}

	private handleFullScreenInteractions(): void {
		if (!this.fullScreen) {
			return;
		}

		this.ngSwipeablePanelService.panelActive$
			.pipe(
				filter((panelInfo) => panelInfo.name === this.panelTriggerName),
				takeUntil(this.destroy$),
			)
			.subscribe(({ active }) => {
				this.fullScreenActive = active;

				if (active) {
					this.setInitialFullScreenPositions();
				}
			});
	}

	private setFullScreenPanelActive(active: boolean): void {
		this.ngSwipeablePanelService.setPanelActive({
			name: this.panelTriggerName,
			active,
		});
	}
}
