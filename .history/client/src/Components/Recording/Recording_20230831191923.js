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
  const chunksRef = useRef([]);
  const [progress, setProgress] = useState(0);


  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      
      setStartButton(true);
      
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (evt) => {
        chunksRef.current.push(evt.data);
      };
      setMediaRecorder(newMediaRecorder);
      
      // POST request to start recording
      await axios.post('http://localhost:4000/recording/start', {
        videoPermission: true,
        audioPermission: true
      });
    } catch (error) {
      console.error('Error during getting permissions', error);
    }
  };
  let intervalId;
  
  const startRecording = () => {
    
    mediaRecorder.start();
    let secondsRecorded = 0;

     intervalId = setInterval(() => {
      secondsRecorded += 1;
      setProgress(secondsRecorded);
    }, 1000);
  };

  const stopRecording = async () => {
    
    if (mediaRecorder) {

        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        clearInterval(intervalId);
        setProgress(0);
        
        await axios.post('http://localhost:4000/recording/stop');
  
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
  
        const videoElement = document.getElementById('videoPlayback');
  
        videoElement.src = url;
  
        chunksRef.current = [];
  
        setStartButton(false);
    }
  };
  
  
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h2>Hello {existingUser} ! </h2>
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
         <p style={{backgroundColor:'beige', borderRadius:'0.3rem', border:'2px solid black', padding:'1rem'}}>{progress}</p>
        </div>
        
      </div>
      <video id="videoPlayback" controls autoplay></video>

    </div>
  )
}

export default Recording