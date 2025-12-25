import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsService {

  constructor() { }

  public isEmptyOrUndefined = (value): boolean => {
    return value === "" || value === undefined;
  }

}
