// MIT License
//
// Copyright (c) 2020 Jason Watmore
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface AlertProps {
  id: string | undefined,
  type: string,
  message: string,
  autoclose: boolean,
  fade: boolean,
}

const alertSubject = new Subject();
export const defaultId = 'alerts';

export const alertService = {
  onAlert,
  error,
  warn,
  info,
  success,
  alert,
  clear,
};

export const AlertType = {
  Error: 'error',
  Warn: 'warn',
  Info: 'info',
  Success: 'success',
};

/**
 * Subscribes to the alerts observable.
 *
 * @param id The ID to map alerts to the right container.
 * @returns The subscription to the alerts.
 */
function onAlert(id: string = defaultId) {
  return alertSubject.asObservable().pipe(filter((x: any) => x && x.id === id));
}

/**
 * Send an error alert.
 *
 * @param message The message to display.
 * @param autoclose Whether or not the alert should close on it's own.
 */
function error(message: string, autoclose: boolean) {
  alert({ id: defaultId, type: AlertType.Error, message, autoclose, fade: false });
}

/**
 * Send an warning alert.
 *
 * @param message The message to display.
 * @param autoclose Whether or not the alert should close on it's own.
 */
function warn(message: string, autoclose: boolean) {
  alert({ id: defaultId, type: AlertType.Warn, message, autoclose, fade: false });
}

/**
 * Send an informational alert.
 *
 * @param message The message to display.
 * @param autoclose Whether or not the alert should close on it's own.
 */
function info(message: string, autoclose: boolean) {
  alert({ id: defaultId, type: AlertType.Info, message, autoclose, fade: false });
}

/**
 * Send a success alert.
 *
 * @param message The message to display.
 * @param autoclose Whether or not the alert should close on it's own.
 */
function success(message: string, autoclose: boolean) {
  alert({ id: defaultId, type: AlertType.Success, message, autoclose, fade: false });
}

/**
 * Send an alert with the given {@link AlertProps}.
 *
 * @param alert The alert to show.
 */
function alert(alert: AlertProps) {
  alertSubject.next(alert);
}

/**
 * Clear all current alerts for an alert container.
 *
 * @param id The ID of the container to clear.
 */
function clear(id: string = defaultId) {
  alertSubject.next({ id });
}
