// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { firebase } from "./firebase";

export const environment = {
  baseUrl: 'http://localhost:5001/secondhalf-92707/us-central1/api/',
  // baseUrl: 'https://europe-west3-secondhalf-92707.cloudfunctions.net/api/',
  production: false,
  portaitPlaceholderUrl: '/assets/front_end_images/portrait_placeholder.svg',
  funcrtionsEmulator: true,
  firebase
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
