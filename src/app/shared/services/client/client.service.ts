import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  static formatError(err: any, headers?: any): any {
    let error = {};
    try {
      const errJson = err.error;
      if (
        (err.status === 400 || err.status === 403) &&
        headers &&
        headers.errorCallback
      ) {
        return errJson.errors;
      } else if (err.status === 400) {
        return {
          code: errJson.errors[0].code,
          errorMessage: errJson.errors[0].errorMessage,
          title: errJson.errors[0].errorType,
        };
      } else if (err.status === 500) {
        return {
          errorMessage:
            'Sorry systems are not available. Please contact administrator.',
          title: 'Server Error',
        };
      }
    } catch (e) {
      console.error(e);
    }
    if (err.status > 500) {
      error = {
        errorMessage: err.message
          ? err.message
          : 'Please contact administrator.',
        hideModal: true,
        title: err.error ? err.error : 'Server Error',
      };
    } else if (err.status === 500) {
      error = {
        errorMessage:
          'Sorry systems are not available. Please contact administrator.',
        title: 'Server Error',
      };
    } else if (err.status === 404) {
      const errJson = err.error;
      error = {
        errorMessage: errJson.Result
          ? errJson.Result
          : 'Please contact administrator.',
        hideModal: true,
        title: 'Resource not found',
      };
    } else if (
      typeof err === 'object' &&
      !err.stack &&
      typeof err._body === 'object' &&
      err._body
    ) {
      const resBody = JSON.parse(err._body);
      if (resBody && resBody.errors && resBody.errors[0]) {
        error = {
          code: resBody.errors[0].code,
          errorMessage: resBody.errors[0].errorMessage,
          hideModal: true,
          title: resBody.errors[0].errorType,
        };
      } else if (resBody && resBody.error) {
        error = {
          code: resBody.code,
          errorMessage: resBody.message,
          hideModal: true,
          title: resBody.error,
        };
      } else {
        error = {
          errorMessage: err._body,
          hideModal: true,
          title: err.statusText,
        };
      }
    } else {
      if (err.status === 403) {
        error = {
          errorMessage: err._body
            ? err._body
            : 'Unauthorized. Please contact administrator.',
          title: err.statusText ? err.statusText : 'Access Denied',
        };
      } else {
        if (err.status !== 0) {
          error = {
            errorMessage: err._body ? err._body : 'Empty data returned.',
            hideModal: true,
            title: err.statusText
              ? err.statusText
              : 'Unable to reach the server',
          };
        }
      }
    }
    return error;
  }

  constructor() {}
}
