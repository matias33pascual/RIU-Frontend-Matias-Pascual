import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  show(showLoading: boolean) {
    this._isLoading.set(showLoading);
  }
}
