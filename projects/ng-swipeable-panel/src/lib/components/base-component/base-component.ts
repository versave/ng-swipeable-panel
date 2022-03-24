import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnDestroy {
  public destroy$ = new Subject<unknown>();

  public ngOnDestroy(): void {
    this.destroy$.next(undefined);
  }
}
