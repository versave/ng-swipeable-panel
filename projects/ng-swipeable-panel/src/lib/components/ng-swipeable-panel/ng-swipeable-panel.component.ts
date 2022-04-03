import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { NgSwipeablePanelBaseComponent } from '../ng-swipeable-panel-base/ng-swipeable-panel-base.component';
import { filter, fromEvent, takeUntil } from 'rxjs';
import { NgSwipeablePanelService } from '../../services/ng-swipeable-panel.service';
import { fullScreenAnimations, FullScreenState } from '../../animations/fullscreen-animations';
import { PanelInfo } from '../../models/models';
import { PlatformService } from '../../services/platform.service';

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
	@ViewChild('wrapper', { static: true }) public wrapper: ElementRef<HTMLDivElement>;
	@ViewChild('container', { static: true }) public container: ElementRef<HTMLDivElement>;

	// Todo: Toggle off on click outside of the container
	// todo: Adjust animation transition speeds
	@Input() public fullScreen = false;
	@Input() public panelName = '';

	@Output() public fullScreenExpandedEvent = new EventEmitter<PanelInfo>();

	public currentPosition = this.minContainerHeight;
	public fullScreenExpanded = false;

	private startTouchYPosition = 0;
	private touchYPosition = 0;

	constructor(
		private ngSwipeablePanelService: NgSwipeablePanelService,
		private platformService: PlatformService,
	) {
		super();
	}

	public ngOnInit(): void {
		if (this.fullScreen) {
			this.handleFullScreenInteractions();
			this.setInitialFulScreenSettings();
			this.deactivateFullScreenOnOutsideClick();
		} else {
			this.setInitialTouchPositions();
		}

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
				this.setFullScreenActive(false);
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

		return this.fullScreenExpanded ? FullScreenState.visible : FullScreenState.hidden;
	}

	private setInitialTouchPositions(): void {
		this.currentPosition = this.minContainerHeight;

		if (this.startExpanded) {
			this.currentPosition = this.maxContainerHeight;
			this.touchYPosition = this.maxContainerHeight;
			this.startTouchYPosition = this.getClientRectTopAddition(this.container);
		}
	}

	private setFullScreenPositions(fullScreenStart = false): void {
		this.currentPosition = this.maxContainerHeight;
		this.touchYPosition = this.maxContainerHeight;
		this.startTouchYPosition = fullScreenStart
			? this.getClientRectTopAddition(this.container)
			: this.container.nativeElement.getBoundingClientRect().top - this.minContainerHeight;
	}

	private setInitialFulScreenSettings(): void {
		this.transition = true;

		if (this.startExpanded) {
			this.fullScreenExpanded = true;
			this.setFullScreenPositions(true);
		}
	}

	private readjustOnWindowResize(): void {
		this.onWindowResize$
			.pipe(filter(() => this.isExpanded(this.currentPosition)))
			.subscribe(
				() => (this.startTouchYPosition = this.getClientRectTopAddition(this.container)),
			);
	}

	private handleFullScreenInteractions(): void {
		this.ngSwipeablePanelService.panelActive$
			.pipe(
				filter((panelInfo) => panelInfo.name === this.panelName),
				takeUntil(this.destroy$),
			)
			.subscribe(({ active }) => {
				this.fullScreenExpanded = active;
				this.fullScreenExpandedEvent.emit({
					name: this.panelName,
					active,
				});

				if (active) {
					this.setFullScreenPositions();
				}
			});
	}

	private setFullScreenActive(active: boolean): void {
		if (!active) {
			this.currentPosition = 0;
		}

		this.ngSwipeablePanelService.panelExpanded = {
			name: this.panelName,
			active,
		};
	}

	private deactivateFullScreenOnOutsideClick(): void {
		if (this.platformService.isBrowser()) {
			fromEvent(window, 'click')
				.pipe(
					filter(() => this.fullScreenExpanded),
					takeUntil(this.destroy$),
				)
				.subscribe((event) => {
					const isPointerEvent =
						event instanceof PointerEvent || event instanceof MouseEvent;

					if (
						isPointerEvent &&
						this.wrapper?.nativeElement.contains(event.target as Node) &&
						!this.container?.nativeElement.contains(event.target as Node)
					) {
						this.setFullScreenActive(false);
					}
				});
		}
	}
}
