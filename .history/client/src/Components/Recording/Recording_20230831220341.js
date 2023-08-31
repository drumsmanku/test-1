import React from 'react';
import styles from './Recording.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Recording() {
  const [existingUser, setExistingUser]=useState(localStorage.getItem('user'))
  const navigate=useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/')
  }
  const [startButton, setStartButton] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [progress, setProgress] = useState(0);
  
  
  const webcamChunksRef = useRef([]);
 
  let intervalId = useRef(null);


  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      
      setStartButton(true);
      
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (evt) => {
        webcamChunksRef.current.push(evt.data);
      };
      setMediaRecorder(newMediaRecorder);
      
      await axios.post('http://localhost:4000/recording/start', {
        videoPermission: true,
        audioPermission: true
      });
    } catch (error) {
      console.error('Error during getting permissions', error);
    }
  };

  const startRecording = () => {
    if (intervalId.current) { 
      clearInterval(intervalId.current);
    }
  
    mediaRecorder.start();
    intervalId.current = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 1);
    }, 1000);
  };
  

  const stopRecording = async () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());

        clearInterval(intervalId.current); 
        setProgress(0);

        await axios.post('http://localhost:4000/recording/stop');

        const blobWebcam = new Blob(webcamChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blobWebcam);

        const videoElement = document.getElementById('videoPlayback');
        videoElement.src = url;
        webcamChunksRef.current = []; 
        setStartButton(false);
    }
};


  
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h2 style={{marginLeft:'2rem'}}>Hello {existingUser} ! </h2>
        <div><button className={styles.button} onClick={handleLogout}>Logout</button></div>
      </div>
      <div className={styles.bottomBody}>
        <button className={styles.button} onClick={handlePermissions}>Get Permissions</button>
        {startButton && 
          <div>
            <button className={styles.button} onClick={startRecording}>Start Recording</button>
            <button className={styles.button} onClick={stopRecording}>Stop Recording</button>
          </div>
        }
        <div>
          Time recorded
         <p style={{backgroundColor:'beige', borderRadius:'0.3rem', border:'2px solid black', padding:'1rem'}}>{progress}s</p>
        </div>
        
      </div>
      <div>
          <button onClick={handleScreenPermissions}>Get Screen Recording Permissions</button>
          <button onClick={startScreenRecording}>Start Screen Recording</button>
          <button onClick={stopScreenRecording}>Stop Screen Recording</button>
      </div>
      <video height={500} width={800} id="videoPlayback" controls autoplay></video>


    </div>
  )
}

export default Recording