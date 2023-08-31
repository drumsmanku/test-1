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
  const [recordingTime, setRecordingTime] = useState(0);
  let recordingInterval = null;

  async function getMixedStream() {
    const videoElement = document.createElement('video');
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  
    videoElement.srcObject = screenStream;
  
    let tracks = [...cameraStream.getTracks(), ...screenStream.getTracks()];
    return new MediaStream(tracks);
  }

  const handlePermissions = async () => {
    try {
      const stream = await getMixedStream();
      setStartButton(true);
      
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (evt) => {
        chunksRef.current.push(evt.data);
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
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecordingTime(0);

      // Update the recording time every second
      recordingInterval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      // Stop updating the recording time
      clearInterval(recordingInterval);
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
    }
  };
  
  return (
    <div>
      <button onClick={handlePermissions}>Get Permissions</button>
      {startButton && (
        <div>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
      <h1>Hello {existingUser} ! </h1>
      <div>Recording Progress: {recordingTime}s</div>
      <video id="videoPlayback" controls autoplay></video>
    </div>
  );
}

export default Recording