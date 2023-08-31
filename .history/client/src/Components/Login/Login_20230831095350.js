import React from 'react';
import styles from './Login.module.css'

function Login() {
  return (
    <div className={styles.container}>

      <div className={styles.loginContainer}>
        <form style={{ width:'100%', display:'flex', flexDirection:'column'}}>
            <div style={{marginBottom:'1rem'}}>
              <label htmlFor="email">Email :</label>
              <input type="email" name='email'   placeholder='Email' style={{width:'60%',marginLeft:'2rem' }} />
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label htmlFor="password">Password :</label>
              <input type="password" name='password'   placeholder='Password' style={{width:'60%',marginLeft:'2rem' }} />
            </div>

            <span style={{}}>Don't Have an account?<button style={{background:'none', color:'#36416A', fontSize:'medium', marginLeft:0, padding:0, width:'4rem', cursor:'pointer', border:'none', textDecoration:'underline'}}>Sign Up</button> </span>
        </form>
        <div style={{backgroundColor:'darkblue', height:'100%'}}></div>
      </div>
    </div>
  )
}

export default Login