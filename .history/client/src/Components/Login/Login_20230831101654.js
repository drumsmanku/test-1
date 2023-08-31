import React from 'react';
import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Login() {
  const [check, setCheck]=useState(false)
  const [user, setUser]=useState({
    email:'',
    password:'',
  });

  const handleChange=(event)=>{
    setUser({
      ...user, 
      [event.target.name]:event.target.value
    });
  };

  const login=(event)=>{
    event.preventDefault();
    axios.post('http://localhost:4000/login', user)
    .then(res=>{
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.name);
      const tokenData=localStorage.getItem('token');
      if(tokenData!=='undefined'){
        setCheck(true);
        //navigate to the recording page
      }
      else{
        setCheck(false)
      }

    })
    .catch(err=>console.log(err))
  }
  return (
    <div className={styles.container}>
      <h1>LOGIN TO CONTINUE</h1>
      <div className={styles.loginContainer}>
        <form style={{ width:'100%', display:'flex', flexDirection:'column'}}>
            <div style={{marginBottom:'1rem'}}>
              <label htmlFor="email">Email :</label>
              <input type="email" name='email' value={user.email} onChange={handleChange}  placeholder='Email' style={{width:'60%',marginLeft:'2rem' }} />
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label htmlFor="password">Password :</label>
              <input type="password" name='password' value={user.password} onChange={handleChange}  placeholder='Password' style={{width:'60%',marginLeft:'2rem' }} />
            </div>

            <span style={{marginBottom:'1.5rem'}}>Don't Have an account?<button style={{background:'none', color:'#36416A', fontSize:'medium', marginLeft:0, padding:0, width:'4rem', cursor:'pointer', border:'none', textDecoration:'underline'}}>Sign Up</button> </span>

            <div>
              <button className={styles.button}> Login</button>
            </div>
        </form>
        
      </div>
    </div>
  )
}

export default Login