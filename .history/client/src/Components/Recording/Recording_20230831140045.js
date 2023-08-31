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

  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setStartButton(true);
      
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (evt) => {
        // push each chunk (blobs) in an array
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

  const startRecording = () => {
    mediaRecorder.start();
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      // POST request to stop recording
       await axios.post('http://localhost:4000/recording/stop');
    }
  };
  return (
    <div>
      <button onClick={handlePermissions}>Get Permissions</button>
      {startButton && 
        <div>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      }
      <button onClick={handleLogout}>Logout</button>
      <h1>Hello {existingUser} ! </h1>
    </div>
  )
}

export default Recording