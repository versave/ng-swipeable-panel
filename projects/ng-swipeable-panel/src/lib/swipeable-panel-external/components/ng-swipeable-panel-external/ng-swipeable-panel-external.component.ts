import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import {
	distinctUntilChanged,
	fromEvent,
	map,
	merge,
	skip,
	startWith,
	Subject,
	takeUntil,
} from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { NgSwipeablePanelBaseComponent } from '../ng-swipeable-panel-base/ng-swipeable-panel-base.component';
import { PlatformService } from '../../services/platform.service';

@Component({
	selector: 'ng-swipeable-panel',
	templateUrl: './ng-swipeable-panel-external.component.html',
	styleUrls: ['./ng-swipeable-panel-external.component.scss'],
})
export class NgSwipeablePanelExternalComponent
	extends NgSwipeablePanelBaseComponent
	implements AfterViewInit
{
	@Input() public templateRef: TemplateRef<any>;
	@Input() public expanded = false;
	@Input() public useScrollDirection = false;
	@Input() public scrollDirHidingElement: HTMLElement;

	@ViewChild('swipeableContainer')
	private swipeableContainer: ElementRef<HTMLDivElement>;

	@HostBinding('class.fullscreen') @Input() private fullscreen = false;
	@HostBinding('class.visible-tablet-landscape')
	@Input()
	private visibleTabletLandscape = false;

	public maxStaticHeight = 360;
	public maxHeight = 0;
	public baseHeight = 30;
	public currentHeight = this.baseHeight;
	public hidePanel = false;
	public lockedInteractions = false;

	private startTouchYPosition = 0;
	private touchYPosition = 0;
	private windowScrollStartPosition = 0;
	private _expandPanel$: Subject<boolean> = new Subject<boolean>();
	private _hidePanel$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private changeDetector: ChangeDetectorRef,
		private host: ElementRef<HTMLElement>,
		private platformService: PlatformService,
		@Inject(DOCUMENT) private document: Document,
	) {
		super();
	}

	public ngAfterViewInit(): void {
		const containerHeight = this.swipeableContainer.nativeElement.clientHeight;
		this.maxHeight =
			containerHeight >= this.maxStaticHeight ? this.maxStaticHeight : containerHeight;

		this.changeDetector.detectChanges();

		if (this.expanded || this.fullscreen) {
			this.expandPanel(true);
		}

		if (this.useScrollDirection) {
			this.controlWithScrollDirection(this.scrollDirHidingElement);
		}

		this.listenToExpandPanel();
		this.listenToHidePanel();
		this.destroySelfOnOutsideInteraction();
	}

	public touchMove(e: TouchEvent): void {
		const touchY = e.touches[0].clientY;

		if (this.lockedInteractions) {
			return;
		}

		if (this.transition) {
			this.transition = false;
		}

		if (this.startTouchYPosition === 0) {
			this.startTouchYPosition = touchY;
		}

		this.touchYPosition = -(touchY - this.startTouchYPosition) + this.baseHeight;
		const isAboveMaxHeight = this.touchYPosition >= this.maxHeight;
		const isBelowMinHeight = this.touchYPosition <= this.baseHeight;
		const isBelowHalfPoint = this.isHalfAboveOrBelow('below', this.touchYPosition);

		if (isAboveMaxHeight) {
			this.currentHeight = this.maxHeight;
		} else if (isBelowMinHeight) {
			this.currentHeight = this.baseHeight;
		} else {
			this.currentHeight = this.touchYPosition;
		}

		if (this.fullscreen && isBelowHalfPoint) {
			this.startSelfDestroy();
		}
	}

	public touchEnd(): void {
		this.transition = true;

		if (this.isHalfAboveOrBelow('below', this.currentHeight)) {
			if (this.lockedInteractions) {
				return;
			}

			this.touchYPosition = 0;
			this.startTouchYPosition = 0;
			this.currentHeight = this.baseHeight;
			this.expanded = false;
		} else if (this.isHalfAboveOrBelow('above', this.currentHeight)) {
			this.currentHeight = this.maxHeight;
			this.expanded = true;
		}
	}

	public transitionEnd(): void {
		if (this.fullscreen && this.lockedInteractions) {
			this.destroySelf();
		}
	}

	public setExpandPanel(expand: boolean): void {
		this._expandPanel$.next(expand);
	}

	public setHidePanel(hide: boolean): void {
		this._hidePanel$.next(hide);
	}

	private expandPanel(expanded: boolean): void {
		if (this.platformService.isBrowser()) {
			if (expanded) {
				this.currentHeight = this.maxHeight;
				this.touchYPosition = this.maxHeight;
				this.startTouchYPosition =
					this.swipeableContainer.nativeElement.getBoundingClientRect().top;
			} else {
				this.touchYPosition = 0;
				this.startTouchYPosition = 0;
				this.currentHeight = this.baseHeight;
			}

			this.transition = true;
			this.expanded = expanded;
			this.changeDetector.detectChanges();
		}
	}

	private listenToExpandPanel(): void {
		this._expandPanel$.pipe(takeUntil(this.destroy$)).subscribe((expanded) => {
			if (expanded && !this.expanded) {
				this.expandPanel(expanded);
			} else if (!expanded && this.expanded) {
				this.expandPanel(expanded);
			}
		});
	}

	private listenToHidePanel(): void {
		this._hidePanel$.pipe(takeUntil(this.destroy$)).subscribe((hide) => {
			this.changeDetector.markForCheck();
			this.hidePanel = hide;
		});
	}

	private controlWithScrollDirection(hidingElement?: HTMLElement): void {
		if (this.platformService.isBrowser()) {
			fromEvent(window, 'scroll')
				.pipe(
					map(() => window.scrollY),
					startWith(0),
					skip(1),
					distinctUntilChanged(),
					takeUntil(this.destroy$),
				)
				.subscribe((scrollTop) => {
					if (hidingElement) {
						const windowBottom = scrollTop + window.innerHeight;
						const elementBottom = hidingElement.offsetTop + hidingElement.offsetHeight;
						const elementVisible =
							windowBottom > hidingElement.offsetTop && scrollTop < elementBottom;

						if (elementVisible) {
							this.expandPanel(false);
							return;
						}
					}

					if (
						scrollTop + window.innerHeight <=
						this.document.body.clientHeight - this.baseHeight
					) {
						if (this.windowScrollStartPosition > scrollTop && !this.expanded) {
							this.expandPanel(true);
						} else if (this.windowScrollStartPosition < scrollTop && this.expanded) {
							this.expandPanel(false);
						}
					}

					this.windowScrollStartPosition = scrollTop;
				});
		}
	}

	private destroySelfOnOutsideInteraction(): void {
		if (this.fullscreen && this.platformService.isBrowser()) {
			merge(fromEvent(window, 'popstate'), fromEvent(window, 'click'))
				.pipe(skip(1), takeUntil(this.destroy$))
				.subscribe((event) => {
					const isPointerEvent = event instanceof PointerEvent;

					if (
						isPointerEvent &&
						!this.swipeableContainer.nativeElement.contains(event.target as Node)
					) {
						this.startSelfDestroy();
					} else if (!isPointerEvent) {
						this.destroySelf();
					}
				});
		}
	}

	private startSelfDestroy(): void {
		this.currentHeight = 0;
		this.lockedInteractions = true;
		this.transition = true;
		this.changeDetector.markForCheck();
	}

	private destroySelf(): void {
		this.host.nativeElement.remove();
	}
}
