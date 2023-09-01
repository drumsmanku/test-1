import firebase from 'firebase/app';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyCWOx-8KHNZfDrvB6s80xXwPoyrbQ5-jmc",
  authDomain: "recording-screen-web.firebaseapp.com",
  projectId: "recording-screen-web",
  storageBucket: "recording-screen-web"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const storage = firebase.storage();

export { storage };
