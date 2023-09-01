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
  const [startWebcamButton, setStartWebcamButton] = useState(false);
  const [startScreenButton, setStartScreenButton] = useState(false);
  const [mediaRecorderWebcam, setMediaRecorderWebcam] = useState(null);
  const [mediaRecorderScreen, setMediaRecorderScreen] = useState(null);
  const [progressWebcam, setProgressWebcam] = useState(0);
  const [progressScreen, setProgressScreen] = useState(0);
  
  
  const webcamChunksRef = useRef([]);
  const screenChunksRef = useRef([]);
 
  const intervalWebcamId = useRef(null);
  const intervalScreenId = useRef(null);


  const handleWebcamPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setStartWebcamButton(true);
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (evt) => {
        webcamChunksRef.current.push(evt.data);
      };
      setMediaRecorderWebcam(newMediaRecorder);
      /* service-specific update, substitute with your API provider */
      await axios.post('http://localhost:4000/recording/start', {
        videoPermission: true,
        audioPermission: true
      });
    } catch (error) {
      console.error('Error during getting permissions', error);
    }
  };
  

  const handleScreenPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStartScreenButton(true);
      const newMediaRecorderScreen = new MediaRecorder(stream);
      newMediaRecorderScreen.ondataavailable = (evt) => {
        screenChunksRef.current.push(evt.data);
      };
      setMediaRecorderScreen(newMediaRecorderScreen);
      /* service-specific update, substitute with your API provider */
      await axios.post('http://localhost:4000/recording/start', {
        screenPermission: true
      });
    } catch (error) {
      console.error('Error during getting permissions', error);
    }
  };


  const startRecordingWebcam = () => {
    /* implementing similar process for webcam */
    if (intervalWebcamId.current) {
      clearInterval(intervalWebcamId.current);
    }
    mediaRecorderWebcam.start();
    intervalWebcamId.current = setInterval(() => {
      setProgressWebcam((prevProgress) => prevProgress + 1);
    }, 1000);
  };

  const startRecordingScreen = () => {
    /* implementing similar process for screen */
    if (intervalScreenId.current) {
      clearInterval(intervalScreenId.current);
    }
    mediaRecorderScreen.start();
    intervalScreenId.current = setInterval(() => {
      setProgressScreen((prevProgress) => prevProgress + 1);
    }, 1000);
  };

  

  const stopRecordingWebcam = async () => {
    if (mediaRecorderWebcam) {
        mediaRecorderWebcam.stop();
        mediaRecorderWebcam.stream.getTracks().forEach(track => track.stop());

        clearInterval(intervalWebcamId.current); 
        setProgressWebcam(0);

        await axios.post('http://localhost:4000/recording/stop');

        const blobWebcam = new Blob(webcamChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blobWebcam);

        const videoElementWebcam = document.getElementById('videoPlayback');
        videoElementWebcam.src = url;
        webcamChunksRef.current = []; 
        setStartWebcamButton(false);
    }
};

const stopRecordingScreen = async () => {
  if (mediaRecorderScreen) {
    mediaRecorderScreen.stop();
    mediaRecorderScreen.stream.getTracks().forEach(track => track.stop());
    clearInterval(intervalScreenId.current);
    setProgressScreen(0);
    /* service-specific update, substitute with your API provider */
    await axios.post('http://localhost:4000/recording/stop');
    const blobScreen = new Blob(screenChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blobScreen);
    const videoElementScreen = document.getElementById('screenPlayback');
    videoElementScreen.src = url;
    screenChunksRef.current = [];
    setStartScreenButton(false);
  }
};


  
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h2 style={{marginLeft:'2rem'}}>Hello {existingUser} ! </h2>
        <div><button className={styles.button} onClick={handleLogout}>Logout</button></div>
      </div>
      <div className={styles.bottomBody}>


        <div className={styles.webButtons}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <button className={styles.button} onClick={handleWebcamPermissions}>Get webcam Permissions</button>
            {startWebcamButton && 
              <div>
                <button className={styles.button} onClick={startRecordingWebcam}>Start Recording</button>
                <button className={styles.button} onClick={stopRecordingWebcam}>Stop Recording</button>
              </div>
            }
          </div>
          
          <div>
            Time recorded
          <p style={{backgroundColor:'beige', borderRadius:'0.3rem', border:'2px solid black', padding:'1rem'}}>{progressWebcam}s</p>
          </div>
        </div>

        <div className={styles.screenButtons}>
          <button className={styles.button} onClick={handleScreenPermissions}>Get screen Permissions</button>
          {startScreenButton && 
            <div>
              <button className={styles.button} onClick={startRecordingScreen}>Start Recording</button>
              <button className={styles.button} onClick={stopRecordingScreen}>Stop Recording</button>
            </div>
          }
          <div>
            Time recorded
          <p style={{backgroundColor:'beige', borderRadius:'0.3rem', border:'2px solid black', padding:'1rem'}}>{progressScreen}s</p>
          </div>
        </div>
        
        
      </div>
      <div style={{display:'flex', justifyContent:'space-around', width:'100%'}}>
        <span style={{textAlign:'center'}}>
          <h2>Webcam Recording</h2>
          <video height={500} width={700} id="videoPlayback" controls autoplay></video>
        </span>
        <span style={{textAlign:'center'}}>
          <h2>Screen Recording</h2>
          <video height={500} width={700} id="screenPlayback" controls autoplay></video>
        </span>
      </div>
      


    </div>
  )
}

export default Recording