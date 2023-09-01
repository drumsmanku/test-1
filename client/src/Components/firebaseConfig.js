import { initializeApp } from 'firebase/app';
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCWOx-8KHNZfDrvB6s80xXwPoyrbQ5-jmc",
  authDomain: "recording-screen-web.firebaseapp.com",
  projectId: "recording-screen-web",
  storageBucket: "recording-screen-web.appspot.com",
  messagingSenderId: "416107869470",
  appId: "1:416107869470:web:89d424f54ec1cc4189850f",
  measurementId: "G-7W6L7TMK5B"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
