import React from 'react';
import styles from './Login.module.css'

function Login() {
  return (
    <div className={styles.container}>

      <div className={styles.loginContainer}>
        <form style={{ width:'100%', display:'flex', flexDirection:'column'}}>
            <div>
              <label htmlFor="email">Email :</label>
              <input type="email" name='email'   placeholder='Email' style={{width:'60%',marginLeft:'2rem' }} />
            </div>
        </form>

      </div>
    </div>
  )
}

export default Login