import {
	ComponentFactoryResolver,
	ComponentRef,
	Injectable,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { NgSwipeablePanelExternalComponent } from '../components/ng-swipeable-panel-external/ng-swipeable-panel-external.component';

@Injectable({
	providedIn: 'root',
})
export class NgSwipeablePanelService {
	private _containerRef: ViewContainerRef | undefined;
	private panelRefs: PanelRef[] = [];

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	public setContainerRef(ref: ViewContainerRef): void {
		this._containerRef = ref;
	}

	public createPanel(
		panelId: string,
		templateContentRef: TemplateRef<any>,
		settings?: PanelSettings,
	): void {
		if (this._containerRef) {
			console.log('tr');
			const factory =
				this.componentFactoryResolver.resolveComponentFactory(
					NgSwipeablePanelExternalComponent,
				);
			let componentRef = this._containerRef?.createComponent(factory);

			componentRef.instance.templateRef = templateContentRef;

			if (settings) {
				componentRef = this.addPanelSettings(componentRef, settings);
			}

			if (!settings?.fullscreen) {
				this.panelRefs.push({ id: panelId, componentRef });
			}
		}
	}

	public destroyPanel(panelId: string): void {
		const foundPanel = this.panelRefs.find((ref) => ref.id === panelId);

		if (foundPanel) {
			foundPanel.componentRef.destroy();
		}
	}

	public expandPanel(panelId: string, expanded: boolean): void {
		const foundPanel = this.panelRefs.find((panel) => panel.id === panelId);

		if (foundPanel) {
			foundPanel.componentRef.instance.setExpandPanel(expanded);
		}
	}

	public hidePanels(hide: boolean): void {
		this.panelRefs.forEach((ref) =>
			ref.componentRef.instance.setHidePanel(hide),
		);
	}

	public destroyAll(): void {
		this.panelRefs.forEach((ref) => ref.componentRef.destroy());
		this.panelRefs = [];
	}

	private addPanelSettings(
		componentRef: ComponentRef<NgSwipeablePanelExternalComponent>,
		settings: PanelSettings,
	): ComponentRef<NgSwipeablePanelExternalComponent> {
		for (const [key, value] of Object.entries(settings)) {
			componentRef.instance[key as keyof PanelSettings] =
				value as boolean & HTMLElement;
		}

		return componentRef;
	}
}

interface PanelRef {
	id: string;
	componentRef: ComponentRef<NgSwipeablePanelExternalComponent>;
}

interface PanelSettings {
	expanded?: boolean;
	fullscreen?: boolean;
	visibleTabletLandscape?: boolean;
	useScrollDirection?: boolean;
	scrollDirHidingElement?: HTMLElement;
}

export enum Panels {
	swipeableContent = 'swipeableContent',
}
