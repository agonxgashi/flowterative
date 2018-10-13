import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

// Below Injectable is a service that intercepts on each http request
// It shows a loading indicator on top navbar when communicating with server
// and removes it when a response is retuned.
@Injectable()
export class LoadingManager {
    public isLoading$: Observable<boolean>;
    private _isLoadingObserver = new Subscriber<boolean>();
    private _isLoading: boolean;

    constructor() {
        this.isLoading$ = new Observable(observer => {
            this._isLoadingObserver = observer;
        });
    }

    load() {
        this._isLoadingObserver.next(this._isLoading);
    }

    public changeValue(value: boolean) {
        this._isLoading = value;
        this._isLoadingObserver.next(this._isLoading);
    }
}
