import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private listVisibleSubject = new BehaviorSubject<boolean>(true);
  private detailsVisibleSubject = new BehaviorSubject<boolean>(false);
  private resetVisibleSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string>('');

  listVisible$ = this.listVisibleSubject.asObservable();
  detailsVisible$ = this.detailsVisibleSubject.asObservable();
  resetVisible$ = this.resetVisibleSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Shows the list view and hides the details view.
   * Updates the corresponding observables to reflect the visibility changes.
   * Navigates to the root route ('') when the list view is shown.
   *
   * @returns {void}
   */
  showList() {
    this.listVisibleSubject.next(true);
    this.detailsVisibleSubject.next(false);
    // this.showReset();
    this.router.navigate(['']);
  }

  /**
   * Shows the details view and hides the list view.
   * Updates the corresponding observables to reflect the visibility changes.
   *
   * @returns {void}
   */
  showDetails() {
    this.listVisibleSubject.next(false);
    this.resetVisibleSubject.next(false);
    this.detailsVisibleSubject.next(true);
  }

  showReset() {
    this.resetVisibleSubject.next(true);
  }

  /**
   * Retrieves the error message observable.
   *
   * Subscribing to this observable will allow components to receive real-time updates
   * about the error message that needs to be displayed in the application.
   *
   * @returns {Observable<string>} - An observable that emits the current error message.
   */
  getErrorMessage(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  /**
   * Sets the error message to be displayed in the application.
   *
   * @param message - The error message to be displayed.
   *
   * @returns {void}
   */
  setErrorMessage(message: string) {
    this.errorSubject.next(message);
  }
}
