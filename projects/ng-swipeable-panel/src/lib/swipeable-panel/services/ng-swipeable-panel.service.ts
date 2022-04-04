import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PanelInfo } from '../../shared/models/models';

@Injectable({
	providedIn: 'root',
})
export class NgSwipeablePanelService {
	private _panelExpanded$: Subject<PanelInfo> = new Subject<PanelInfo>();

	public get panelExpanded$(): Observable<PanelInfo> {
		return this._panelExpanded$.asObservable();
	}

	public set panelExpanded(panelInfo: PanelInfo) {
		this._panelExpanded$.next(panelInfo);
	}
}
