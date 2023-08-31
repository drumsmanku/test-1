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
    let secondsRecorded = 0;

    const intervalId = setInterval(() => {
      secondsRecorded += 1;
      setProgress(secondsRecorded);
    }, 1000);
  };

  const stopRecording = async () => {
    clearInterval(intervalId);
    if (mediaRecorder) {

        mediaRecorder.stop();
  
        // Stops all tracks in the stream (audio and video in your case)
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
  
        // POST request to stop recording
        await axios.post('http://localhost:4000/recording/stop');
  
        // Assemble the chunks into a Blob and create a URL for it
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
  
        // Get a reference to the video element (assuming its ID is 'videoPlayback')
        const videoElement = document.getElementById('videoPlayback');
  
        // Assign the video URL to the video element's source
        videoElement.src = url;
  
        // Clear the array of chunks
        chunksRef.current = [];
  
        // Set start button state to false
        setStartButton(false);
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
      <video id="videoPlayback" controls autoplay></video>

    </div>
  )
}

export default Recording