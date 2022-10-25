import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  loading = false;
  constructor() {}

  showLoader(): void {
    this.loading = true;
  }

  hideLoader(): void {
    this.loading = false;
  }
}
