import React from 'react';
import styles from './Recording.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Recording() {
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/')
  }
  return (
    <div className={styles.container}>
      <button>Start Recording</button>
      <button>Stop Recording</button>
      <button>Logout</button>
    </div>
  )
}

export default Recording