export const environment = {
  production: true,
  MAPBOX_TOKEN: process.env['NG_APP_MAPBOX_TOKEN'] || '',
  firebase: {
    apiKey: process.env['NG_APP_FIREBASE_API_KEY'] || '',
    authDomain: process.env['NG_APP_FIREBASE_AUTH_DOMAIN'] || '',
    projectId: process.env['NG_APP_FIREBASE_PROJECT_ID'] || '',
    storageBucket: process.env['NG_APP_FIREBASE_STORAGE_BUCKET'] || '',
    messagingSenderId: process.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'] || '',
    appId: process.env['NG_APP_FIREBASE_APP_ID'] || '',
    measurementId: process.env['NG_APP_FIREBASE_MEASUREMENT_ID'] || '',
  },
};
