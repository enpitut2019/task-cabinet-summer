/* eslint-disable no-console */

import { register } from 'register-service-worker';
import firebase from "firebase";

if (process.env.NODE_ENV === 'production') {
  // Add Firebase to your JavaScript project
  // https://firebase.google.com/docs/web/setup
  const firebaseConfig = {
    apiKey: 'AIzaSyDlAWtdswE7S_jUzNrnna3h7V5ariXi_e8',
    authDomain: 'task-cabinet.firebaseapp.com',
    databaseURL: 'https://task-cabinet.firebaseio.com',
    projectId: 'task-cabinet',
    storageBucket: '',
    messagingSenderId: '1088200976068',
    appId: '1:1088200976068:web:92569e254386d831',
  };

  firebase.initializeApp(firebaseConfig);

  // Set up a JavaScript Firebase Cloud Messaging client app
  // https://firebase.google.com/docs/cloud-messaging/js/client
  const messaging = firebase.messaging();

  messaging.usePublicVapidKey(
    'BKWGEMGWg78ApjGMWvx8YY0IwTBgJhwnFZDbHfWliWOn7RRVSCVh40SjNnYS18ManOz7uc3nfLTHvjslBvigiM0'
  );

  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      );
    },
    registered(registration) {
      console.log('Service worker has been registered.');

      messaging.useServiceWorker(registration);
      messaging.getToken().then(token => {
        console.log(token);
      });
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
    },
    updated() {
      console.log('New content is available; please refresh.');
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
