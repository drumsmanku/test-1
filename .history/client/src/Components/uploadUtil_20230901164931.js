import { storage } from './firebaseConfig';
import axios from 'axios';

const uploadToCloud = async (blob) => {
  const filename = `recording_${new Date().getTime()}.webm`;

  let ref = storage.ref().child(filename);

  let uploadTask = ref.put(blob);

  uploadTask.on('state_changed', snapshot => {
    // Handle progress
  }, error => {
    // Handle error
  }, () =>  {
    uploadTask.snapshot.ref.getDownloadURL()
      .then(async downloadURL => {
        console.log('File available at', downloadURL);
        await axios.post('http://localhost:4000/recording/save', { videoUrl: downloadURL });
      });
  });
}

export { uploadToCloud };
