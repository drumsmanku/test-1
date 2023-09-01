import {initializeApp } from 'firebase/app';
import { getStorage } from  'firebase/storage';

const config = {
  apiKey: "AIzaSyCWOx-8KHNZfDrvB6s80xXwPoyrbQ5-jmc",
  authDomain: "recording-screen-web.firebaseapp.com",
  projectId: "recording-screen-web",
  storageBucket: "recording-screen-web.appspot.com"
}

if (!firebase.apps.length) {
    initializeApp(config);
}

const storage = getStorage();

export { storage };
