import React from 'react';
import styles from './Login.module.css'

function Login() {
  return (
    <div className={styles.container}>

      <div className={styles.loginContainer}>
        <label htmlFor="email">Email :</label>
        <input type="email" name='email'  onChange={handleChange} placeholder='Email' />

      </div>
    </div>
  )
}

export default Login