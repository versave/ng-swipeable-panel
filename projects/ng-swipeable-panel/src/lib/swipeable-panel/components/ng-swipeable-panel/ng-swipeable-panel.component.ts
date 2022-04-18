import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { NgSwipeablePanelBaseComponent } from '../../../shared/components/ng-swipeable-panel-base/ng-swipeable-panel-base.component';
import { filter, fromEvent, takeUntil } from 'rxjs';
import { NgSwipeablePanelService } from '../../services/ng-swipeable-panel.service';
import { fullScreenAnimations, FullScreenState } from '../../fullscreen-animations';
import { PanelInfo } from '../../../shared/models/models';
import { PlatformService } from '../../../shared/services/platform.service';

@Component({
	selector: 'ng-swipeable-panel',
	templateUrl: './ng-swipeable-panel.component.html',
	styleUrls: [
		'../../../shared/components/ng-swipeable-panel-base/ng-swipeable-panel-base.component.scss',
		'./ng-swipeable-panel.component.scss',
	],
	inputs: NgSwipeablePanelBaseComponent.inputs,
	animations: fullScreenAnimations,
})
export class NgSwipeablePanelComponent extends NgSwipeablePanelBaseComponent implements OnInit {
	@ViewChild('wrapper', { static: true }) public wrapper: ElementRef<HTMLDivElement>;
	@ViewChild('container', { static: true }) public container: ElementRef<HTMLDivElement>;

	// todo: Adjust animation transition
	// todo: cleanup
	// todo: test
	// todo: test ssr
	@Input() public fullScreen = false;
	@Input() public panelName = '';

	@Output() public expandedEvent = new EventEmitter<PanelInfo>();

	public currentPosition = this.minContainerHeight;
	public expanded = false;

	private touchStartYPosition = 0;
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
			this.setInitialFullScreenSettings();
			this.deactivateFullScreenOnOutsideClick();
		} else {
			this.setInitialTouchPositions();
		}

		this.listenForExpandedActions();
		this.readjustOnWindowResize();
	}

	public setTouchStartPositions(event: TouchEvent) {
		const touchY = event.touches[0].clientY;

		if (this.startTouchYPosition === 0) {
			this.startTouchYPosition = touchY;
		}

		this.touchStartYPosition = this.isExpanded(this.currentPosition)
			? -(touchY - this.startTouchYPosition) + this.minContainerHeight
			: 0;
	}

	public setTouchMovePositions(event: TouchEvent): void {
		const touchY = event.touches[0].clientY;
		const touchYDifference =
			this.touchStartYPosition !== 0 ? this.maxContainerHeight - this.touchStartYPosition : 0;

		if (this.transition) {
			this.transition = false;
		}

		this.touchYPosition =
			-(touchY - this.startTouchYPosition) + this.minContainerHeight + touchYDifference;

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
			this.setExpanded(false);
		} else if (this.isHalfAboveOrBelow('above', this.currentPosition)) {
			this.currentPosition = this.maxContainerHeight;
			this.setExpanded(true);
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

		return this.expanded ? FullScreenState.visible : FullScreenState.hidden;
	}

	private setInitialTouchPositions(): void {
		this.currentPosition = this.minContainerHeight;

		if (this.startExpanded) {
			this.currentPosition = this.maxContainerHeight;
			this.startTouchYPosition = this.getClientRectTopAddition(this.container);
			this.expanded = true;
		}
	}

	private setTouchPositions(expanded: boolean): void {
		this.currentPosition = expanded ? this.maxContainerHeight : this.minContainerHeight;
		this.startTouchYPosition = expanded
			? this.container.nativeElement.getBoundingClientRect().top
			: 0;
	}

	private setFullScreenTouchPositions(fullScreenStart = false): void {
		this.currentPosition = this.maxContainerHeight;
		this.touchYPosition = this.maxContainerHeight;
		this.startTouchYPosition = fullScreenStart
			? this.getClientRectTopAddition(this.container)
			: this.container.nativeElement.getBoundingClientRect().top - this.minContainerHeight;
	}

	private setInitialFullScreenSettings(): void {
		if (this.startExpanded) {
			this.expanded = true;
			this.setFullScreenTouchPositions(true);
		}
	}

	private readjustOnWindowResize(): void {
		this.onWindowResize$
			.pipe(filter(() => this.isExpanded(this.currentPosition)))
			.subscribe(
				() => (this.startTouchYPosition = this.getClientRectTopAddition(this.container)),
			);
	}

	private listenForExpandedActions(): void {
		this.ngSwipeablePanelService.panelExpanded$
			.pipe(
				filter((panelInfo) => panelInfo.name === this.panelName),
				takeUntil(this.destroy$),
			)
			.subscribe(({ active }) => {
				this.expandedEvent.emit({
					name: this.panelName,
					active,
				});

				if (this.expanded === active) {
					return;
				}

				this.expanded = active;

				if (this.fullScreen) {
					if (active) {
						this.setFullScreenTouchPositions();
					}
				} else {
					this.setTouchPositions(active);
				}
			});
	}

	private setExpanded(active: boolean): void {
		this.expanded = active;
		this.ngSwipeablePanelService.panelExpanded = {
			name: this.panelName,
			active,
		};
	}

	private deactivateFullScreenOnOutsideClick(): void {
		if (this.platformService.isBrowser()) {
			fromEvent(window, 'click')
				.pipe(
					filter(() => this.expanded),
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
						this.setExpanded(false);
					}
				});
		}
	}
}
