import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PanelInfo } from '../models/models';

@Injectable({
	providedIn: 'root',
})
export class NgSwipeablePanelService {
	private _panelActive$: Subject<PanelInfo> = new Subject<PanelInfo>();

	public get panelActive$(): Observable<PanelInfo> {
		return this._panelActive$.asObservable();
	}

	public set panelActive(panelInfo: PanelInfo) {
		this._panelActive$.next(panelInfo);
	}
}
