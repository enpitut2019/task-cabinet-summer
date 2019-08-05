'use strict';


let sessionId = null;
const INTERVAL_TIME = 1000;

self.addEventListener('install', function() {
    console.log('install now!!');
    if (sessionId !== null) {
        clearInterval(sessionId);
        sessionId = null;
    }
    loopSayHello(INTERVAL_TIME, 'install');
});

self.addEventListener('update', function() {
    console.log('update now!!');
    if (sessionId !== null) {
        clearInterval(sessionId);
        sessionId = null;
    }
    loopSayHello(INTERVAL_TIME, 'update');
});

self.addEventListener('fetch', function() {
    console.log('fetch now!!');
    if (sessionId !== null) {
        clearInterval(sessionId);
        sessionId = null;
    }
    loopSayHello(INTERVAL_TIME, 'fetch');
});

self.addEventListener('activate', function() {
    console.log('activate now!!');
    if (sessionId !== null) {
        clearInterval(sessionId);
        sessionId = null;
    }
    loopSayHello(INTERVAL_TIME, 'activate');
});

const loopSayHello = (time, message) => {
    sessionId = setInterval(() => {
        console.log(`hello time:${time} message:${message}`);
        self.registration.showNotification(message, {
            body: "Push通知本文"
        });
    }, time);
};