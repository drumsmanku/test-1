import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";
import axios from "axios";

const uploadToCloud = async (blob, recordingId, sampleVar) => {
  const filename = `recording_${new Date().getTime()}.webm`;
  const storageRef = ref(storage, filename);

  const uploadTask = uploadBytesResumable(storageRef, blob);

  uploadTask.on('state_changed', 
    (snapshot) => {
      // Handle progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, 
    (error) => {
      // Handle error
      console.error('Upload failed:', error);
    }, 
    async () => {
      // Handle successful upload
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("File available at", downloadURL);
      if(sampleVar===0){
        await axios.post("http://localhost:4000/recording/savewebcam", { videoUrl: downloadURL || '', recordingId });
      }
      else{
        await axios.post("http://localhost:4000/recording/savescreen", { videoUrl: downloadURL || '', recordingId });
      }
      
    }
  );
}

export { uploadToCloud };
