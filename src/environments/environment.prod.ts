// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const ports = {
  admin: 80,
  customer: 8080,
  api: 3000,
};
const serverIPDomain = '127.0.0.1';
const apiPathWithPort = 'http://' + serverIPDomain + ':' + ports.api + '/';
export const environment = {
  production: true,
  appVersion: 'v1.0.0',
  USERDATA_KEY: 'auths3cr3tAll!@nc3UD@atm',
  isMockEnabled: false,
  apiUrl: apiPathWithPort + 'v1/',
  apiServerPath: apiPathWithPort + 'uploads/',
  maxLimit: 1000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
