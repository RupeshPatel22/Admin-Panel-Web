importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts(
    "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);
const firebaseConfigDev = {
    apiKey: "AIzaSyBWd2Wts4epxav0SlUE7iGqkFMES4TGpjY",
    authDomain: "speedyy-admin-dev.firebaseapp.com",
    projectId: "speedyy-admin-dev",
    storageBucket: "speedyy-admin-dev.appspot.com",
    messagingSenderId: "449152509736",
    appId: "1:449152509736:web:cf2cb4e2568830fa5a521d",
    measurementId: "G-T94ZPRNFXE"
};

const firebaseConfigStaging = {
  apiKey: "AIzaSyACPYA23Vrt_p0MbmzLPhDGVoMH4OEkDRo",
  authDomain: "speedyy-admin-staging.firebaseapp.com",
  projectId: "speedyy-admin-staging",
  storageBucket: "speedyy-admin-staging.appspot.com",
  messagingSenderId: "821016896956",
  appId: "1:821016896956:web:e652ac55f36cf9e1ab77b9",
  measurementId: "G-0DCJQV8C41"
};

const firebaseConfigProd = {
    apiKey: "AIzaSyAet7pqB4HSqw6DZtK4p9hADvAZvWXIiE0",
    authDomain: "speedyy-admin-prod-1.firebaseapp.com",
    projectId: "speedyy-admin-prod-1",
    storageBucket: "speedyy-admin-prod-1.appspot.com",
    messagingSenderId: "892260358475",
    appId: "1:892260358475:web:f1ab4467d4b93bbb5b70ce",
    measurementId: "G-21KLG3XGD0"
};


// Initialize Firebase
if (location.hostname === 'admin.speedyy.com') {
  firebase.initializeApp(firebaseConfigProd);
} else if (location.hostname === 'admin.staging.speedyy.com') {
  firebase.initializeApp(firebaseConfigStaging);
} else {
  firebase.initializeApp(firebaseConfigDev);
}

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Customize notification here
    console.log('Received bg notification', payload);
    const notificationTitle = payload.notification.title;
    console.log("", notificationTitle);
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image
        };
    if(notificationTitle === 'New Order'){
      notificationOptions.sound = payload.data.order_placed_notification_sound;
    }
    if(notificationTitle === 'Order Cancelled'){
      notificationOptions.sound = payload.data.order_cancelled_notification_sound;
    }
    // if(notificationTitle === 'Order No Rider Available'){
    //   notificationOptions.sound = payload.data.order_cancelled_notification_sound;
    // }
    // const audio = new Audio('src/assets/audio/new-order-notification-sound.mp3'); // replace with path to your audio file
    // audio.play(); // play the audio
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  // audio.pause();
    event.waitUntil(
      clients.matchAll({ includeUncontrolled: true }).then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (const client of windowClients) {
          // If so, just focus it.
          if (client.url.includes(location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
          return clients.openWindow(location.origin);
        }
      })
    );
  });