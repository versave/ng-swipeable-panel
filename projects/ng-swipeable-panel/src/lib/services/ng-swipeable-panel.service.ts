import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PanelInfo } from '../models/models';

// todo: Limit scope
@Injectable({
	providedIn: 'root',
})
export class NgSwipeablePanelService {
	private _panelActive$: Subject<PanelInfo> = new Subject<PanelInfo>();

	public get panelActive$(): Observable<PanelInfo> {
		return this._panelActive$.asObservable();
	}

	public setPanelActive(value: PanelInfo): void {
		this._panelActive$.next(value);
	}
}
