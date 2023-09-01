import firebase from 'firebase/app';
import 'firebase/storage';

const config = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const storage = firebase.storage();

export { storage };
